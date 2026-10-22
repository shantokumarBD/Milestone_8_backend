import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'


const app = express()

const PORT = process.env.PORT || 3000

// middleware 
app.use(cors())
app.use(express.json())


// MongoDB client 
const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nnw7zhs.mongodb.net/`);

// connect to MongoDB and function
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// database and collection 
const connectedClient = await connectToMongoDB()
const database = connectedClient.db("backend")
const usersCollection = database.collection("data")


app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.get('/users', async (req, res) => {
  try {
    const cursor = usersCollection.find({})
    const users = await cursor.toArray()
    res.send(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body
    const result = await usersCollection.insertOne({ name, email })
    console.log(result)
    res.status(201).send(result)
  } catch (error) {
    console.error('Error inserting user:', error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id
    const query = { _id: new ObjectId(id) }

    const result = await usersCollection.findOne(query)
    if (!result) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.send(result)
  } catch (error) {
    console.error('Error fetching user by id:', error)
    res.status(500).json({ error: error.message })
  }
})

app.put('/users/:id', async (req, res) => {
  try {
    const id = req.params.id
    const query = { _id: new ObjectId(id) }
    const { name, email } = req.body
    const updatedUser = { name, email }

    const result = await usersCollection.updateOne(query, { $set: updatedUser })

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.send(result)
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: error.message })
  }
})

app.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id
    const query = { _id: new ObjectId(id) }

    const result = await usersCollection.deleteOne(query)

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.send(result)
  } catch (error) {
    console.error('Error deleting user by id:', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, ()=>{
    console.log(`server is runing on port ${PORT}`); 
})
