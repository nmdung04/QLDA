import clientPromise from '../../utils/db';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('projects');

  if (req.method === 'GET') {
    // Lấy userId từ query
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const projects = await collection.find({ userId }).toArray();
    return res.status(200).json(projects);
  }

  if (req.method === 'POST') {
    // Nếu là update clips cho project
    if (req.body.updateClips && req.body._id) {
      const { _id, clips, status } = req.body;
      const { ObjectId } = require('mongodb');
      const updateFields = {};
      if (clips) updateFields.clips = clips;
      if (status) updateFields.status = status;
      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateFields }
      );
      if (result.modifiedCount === 1) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ error: 'Project not found or not updated' });
      }
    }
    // Thêm mới project
    const { userId, title, videoCount, dateModified, thumbnail, url, videoMeta, clips, status } = req.body;
    if (!userId || !title) return res.status(400).json({ error: 'Missing required fields' });
    const newProject = {
      userId,
      title,
      videoCount: videoCount || 0,
      dateModified: dateModified || new Date().toISOString(),
      thumbnail: thumbnail || '',
      url: url || '',
      videoMeta: videoMeta || {},
      status: status,
      clips: clips || [],
    };
    const result = await collection.insertOne(newProject);
    return res.status(201).json({ ...newProject, _id: result.insertedId });
  }

  // Xóa project
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing project id' });
    const { ObjectId } = require('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ error: 'Project not found' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
