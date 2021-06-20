import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import {connectToDatabase} from "../../../lib/db";
import {verifyPassword} from "../../../lib/auth";

export default NextAuth({
  session: {
    jwt: true
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials, req) {
        const client = await connectToDatabase();
        const userCollection = client.db().collection('users');
        const user = await userCollection.findOne({email: credentials.email});
        console.log('Begin login');
        if (!user) {
          console.log('Wrong username');
          throw new Error('No user found');
        }
        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) {
          console.log('Wrong password');
          throw new Error('Cannot login');
        }
        client.close();
        console.log('Login successfull');
        return{email: user.email};
      }
    })
  ]
});