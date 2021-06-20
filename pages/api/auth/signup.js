import {connectToDatabase} from "../../../lib/db";
import {hashPhassword} from "../../../lib/auth";

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    const {email, password} = data;
    if (!email ||
      !email.includes('@') ||
      !password ||
      password.trim().length < 7) {
      res.status(422).json({ message: 'Invalid login information' });
      return;
    }
    const hashedPassword = await hashPhassword(password);
    const client = await connectToDatabase();
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email: email });
    if (existingUser) {
      res.status(422).join({message: 'User exists already'});
      return;
    }

    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword
    });
    res.status(201).json({ message: 'User created' });
  }

}

export default handler;