import clientPromise from '../../db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Full name, email and password are required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      fullName,
      password: hashedPassword,
      createdAt: new Date(),
    };
    const result = await db.collection('users').insertOne(newUser);
    const { password: pwd, ...userData } = newUser;
    return res.status(201).json({ user: userData });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
