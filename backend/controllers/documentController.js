import db from '../config/knex.js';
const userId = "8bb68d17-f91a-41b7-a3b7-905fcdbf89fd";
const getDocuments = async (req, res) => {
  try {
    // We assume Passport attaches the user object on req
    // const userId = req.user && req.user.user_id;
    // if (!userId) {
    //   return res.status(400).json({ error: 'User ID not found.' });
    // }

    // Query the database for the user's documents
    const documents = await db('documents')
      .select('document_id', 'title', 'updated_at')
      .where({ user_id: userId })
      .orderBy('updated_at', 'desc');

    return res.status(200).json({ documents });
  } catch (error) {
    console.error('Error fetching dashboard documents:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createDocument = async (req, res) => {

  // const userId = req.user && req.user.user_id;
  // if (!userId) {
  //   return res.status(400).json({ error: 'User ID not found.' });
  // }
  try {
    const document = await db('documents').insert({
      user_id: userId,
      title: 'Untitled Document',
    }).returning('*');
    return res.status(200).json({ document });
  } catch (error) {
    console.error('Error creating document:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getDocument = async (req, res) => {
  const { documentId } = req.params;
  // const userId = req.user && req.user.user_id;
  // if (!userId) {
  //   return res.status(400).json({ error: 'User ID not found.' });
  // }
  try {
    const document = await db('documents').where({ user_id: userId, document_id: documentId }).first(['content','title']);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    return res.status(200).json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateDocumentContent = async (req, res) => {
  const { documentId } = req.params;
  const { content } = req.body;
  // const userId = req.user && req.user.user_id;
  // if (!userId) {
  //   return res.status(400).json({ error: 'User ID not found.' });
  // }
  try {
    const document = await db('documents').where({ user_id: userId, document_id: documentId }).update({ content, updated_at: new Date() });
    if (!document || document.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    return res.status(200);
  } catch (error) {
    console.error('Error updating document:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const renameDocument = async (req, res) => {
  const { documentId } = req.params;
  const { title } = req.body;
  // const userId = req.user && req.user.user_id;

  // if (!userId) {
  //   return res.status(400).json({ error: 'User ID not found.' });
  // }
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Invalid title.' });
  }

  try {
    const updated = await db('documents')
      .where({ user_id: userId, document_id: documentId })
      .update({ title, updated_at: new Date() })
      .returning(['document_id', 'title', 'updated_at']);

    if (!updated || updated.length === 0) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    return res.status(200).json({ document: updated[0] });
  } catch (error) {
    console.error('Error renaming document:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteDocument = async (req, res) => {
  const { documentId } = req.params;
  // const userId = req.user && req.user.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID not found.' });
  }

  try {
    const deleted = await db('documents')
      .where({ user_id: userId, document_id: documentId })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    return res.status(200).json({ message: 'Document deleted successfully.' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
    getDocuments,
    createDocument,
    getDocument,
    updateDocumentContent,
    renameDocument,
    deleteDocument
};