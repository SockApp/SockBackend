const Ajv = require('ajv');
const admin = require('firebase-admin');

function documentFactory(collectionName, schema) {
  class Document {
    static get collection() {
      return admin.firestore().collection(collectionName);
    }

    static async create(doc, id) {
      const ajv = new Ajv({ useDefaults: true, removeAdditional: 'all', coerceTypes: true });
      const isValid = ajv.validate(doc, schema);
      if(!isValid) {
        throw new Error('Validation Error');
      }

      delete doc.id;
      const ref = id ? this.collection.doc(id) : this.collection.doc();
      try {
        await ref.set(doc);
        return ref.id;
      } catch (e) {
        throw e;
      }
    }

    static async getById(id) {
      try {
        const doc = await this.collection.doc(id).get();
        return formatDoc(doc);
      } catch (e) {
        throw e;
      }
    }

    static async getByFields(fields) {
      try {
        const snapshot = await this._buildQuery(fields).get();
        return snapshot.docs.map(formatDoc);
      } catch(e) {
        throw e;
      }
    }

    static update(id, updates) {
      return this.collection.doc(id).update(this._buildUpdates(updates));
    }

    static async deleteByFields(fields) {
      try {
        const snapshot = await this._buildQuery(fields).get();
        const batch = admin.firestore().batch();

        snapshot.forEach(doc =>  {
          // For each doc, add a delete operation to the batch
          batch.delete(doc.ref);
        });

        // Commit the batch
        return batch.commit();
      } catch (e) {
        throw e;
      }
    }

    static deleteById(id) {
      return this.collection.doc(id).delete();
    }

    static _buildQuery(fields) {
      let query = this.collection;
      Object.entries(fields).forEach(([key, value]) => {
        query = query.where(key, '==', value);
      });
      return query;
    }

    static _buildUpdates(updates) {
      const result = Object.assign({}, updates);
      Object.entries(result).forEach(([k, v]) => {
        if(v === Document.ops.DELETE) {
          result[k] = admin.firestore.FieldValue.delete()
        }
      });
      return result;
    }
  }

  Document.ops = {
    DELETE: Symbol('delete')
  };

  return Document;
}

function formatDoc(doc) {
  if(!doc.exists) {
    return null;
  }
  return Object.assign({ id: doc.id }, doc.data());
}

module.exports = documentFactory;
