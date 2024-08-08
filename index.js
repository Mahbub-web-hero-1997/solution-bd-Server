const express = require('express');
const cors = require('cors');
const app=express()
app.use(express.json());
app.use(cors())
require('dotenv').config()
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ofgbopf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();    
    const serviceCollection = client.db('services').collection('service')
    const carouselCollections = client.db('carousels').collection('carousel')
      // ***************************************************************************************************
      //                                       banner API's Hare
      // ***************************************************************************************************
       // post a carousel
    app.post('/carousels', async (req, res) => {
      const cursor = req.body;
      console.log(cursor)
      const result = await carouselCollections.insertOne(cursor);
      console.log(result)
      res.send(result);      
    }) 
    // get all carousel
    app.get('/carousels', async (req, res) => { 
      const query = carouselCollections.find()
      const result = await query.toArray();
      res.send(result)
    })
    // update carousel
    app.get('/carousels/:id', async (req, res) => { 
      const id = req.params.id;      
      const filter = { _id: new ObjectId(id) }
      const result = await carouselCollections.findOne(filter);
      console.log(result);
      res.send(result);
    })   
    // update the carousel    
    app.put('/carousels/:id/', async (req, res) => { 
      const id = req.params.id;
      const carousel = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set:{
          title: carousel.title,
          img_url: carousel.img_url,
          discription: carousel.discription,          
        }
      }
      const result = await carouselCollections.updateOne(filter, updateDoc, options)
      res.send(result)
    })
    // Delete a carousel
    app.delete('/carousels/:id', async (req, res)=> { 
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await carouselCollections.deleteOne(query);
      res.send(result)         
      
    })

     //**************************************************************************************************
      //                                       Service API's Hare
      //*************************************************************************************************
   
    // post a service
    app.post('/services', async (req, res) => { 
      const service = req.body;
      console.log(service)
      const result = await serviceCollection.insertOne(service);
      console.log(result)
      res.send(result);
    })

    // Get All Services
    app.get('/services', async (req, res) => { 
      const query = serviceCollection.find();
      const result = await query.toArray();
      res.send(result);
    })

    // Get a single service by its ID
    app.get('/services/:id', async (req, res) => { 
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await serviceCollection.findOne(query);
      res.send(result);
    })

    // update Service

    app.put('/services/:id', async (req, res) => { 
       const id = req.params.id;
      const service = req.body;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = { upsert: true }
      const options = {
        $set: {
          title: service.title,
          discription: service.discription,
          img_url: service.img_url,
          price: service.price,
        }
      }
      const result = await serviceCollection.updateOne(filter, updateDoc, options);
      res.send(result);

    })

    










    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
    console.log('This app listing to port',port);
})