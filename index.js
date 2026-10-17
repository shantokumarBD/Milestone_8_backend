import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb';
import 'dotenv/config'


const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())


const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nnw7zhs.mongodb.net/`);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient = await connectToMongoDB()
const database = connectedClient.db("backend")
const usersCollection = database.collection("data")


app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.get('/users', async (req, res) => {
  const cursor = usersCollection.find({})
  const users = await cursor.toArray()
  res.send(users)
})

app.listen(PORT, ()=>{
    console.log(`server is runing on port ${PORT}`); 
})
