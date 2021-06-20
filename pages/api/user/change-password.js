import { getSession } from "next-auth/client";
import {connectToDatabase} from "../../../lib/db";
import {hashPhassword, verifyPassword} from "../../../lib/auth";

async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }
  const session = await getSession({req: req});
  if (!session) {
    res.status(401).jsonp({message: 'Not authenticated'});
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();
  const userCollection = client.db().collection('users');
  const user = await userCollection.findOne({email: userEmail});
  if (!user) {
    res.status(404).json({message: 'User not found'});
    client.close();
    return;
  }
  const currentPassword = user.password;
  const isValid = await verifyPassword(oldPassword, currentPassword);
  if (!isValid) {
    res.status(422).json({message: 'Password is incorrect'});
    client.close();
    return;
  }

  const hashedNewPassord = hashPhassword(newPassword);
  const result = await userCollection.updateOne({email: userEmail}, {
    $set: {
      password: hashedNewPassord
    }
  });

  client.close();
  res.status(200).json({message: 'Password updated'});

}

export default handler;