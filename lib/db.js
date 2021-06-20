import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
  const client = await MongoClient.connect('mongodb+srv://nhat:nhat@cluster0.8h2u5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
  return client;
}