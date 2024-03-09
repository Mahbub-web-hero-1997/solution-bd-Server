const express = require('express');
const cors = require('cors');
const app=express()
app.use(express.json());
app.use(cors())
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.czyfgjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Api Function
async function run() {
  try {  
    await client.connect();
    const ServiceCollection = client.db("Services").collection('Service');
    // Load All Services Data
      app.get  ('/services', async (req, res) => {
          const cursor = ServiceCollection.find();
          const result = await cursor.toArray();
          res.send(result)
      })
    // Service Details Api
    app.get('/services/:id', async(req,res) => {
      const id = req.params.id;   
      const query = { _id: new ObjectId(id) }
      const options = {
       projection:{ title:1, img:1,description:1, price:1 }
      }
      // CheckOut Api
      app.get('/checkout/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const options = {
          projection: { title: 1, price: 1 }
        }
        const result = await ServiceCollection.findOne(query, options)
        res.send(result)
      })
     console.log(options?.projection)
      const result = await ServiceCollection.findOne(query, options)      
      res.send(result)

    })
      // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {   
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('This app listing to port',port);
})