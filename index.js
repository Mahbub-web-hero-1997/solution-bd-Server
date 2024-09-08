const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ofgbopf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("services").collection("service");
    const bookingCollection = client.db("services").collection("booking");
    const carouselCollections = client.db("carousels").collection("carousel");
    const AboutUsCollections = client.db("aboutUs").collection("about");
    const campaignCollections = client.db("campaigns").collection("campaign");
    // ***************************************************************************************************
    //                                       About Us API's Hare
    // ***************************************************************************************************

    app.get("/campaign", async (req, res) => {
      const query = campaignCollections.find();
      const result = await query.toArray();
      res.send(result);
    });

    // ***************************************************************************************************
    //                                       About Us API's Hare
    // ***************************************************************************************************
    app.post("/about", async (req, res) => {
      const cursor = req.body;
      console.log(cursor);
      const result = await AboutUsCollections.insertOne(cursor);
      console.log(result);
      res.send(result);
    });

    app.get("/about", async (req, res) => {
      const query = AboutUsCollections.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.put("/about", async (req, res) => {
      const id = req.params.id;
      const about = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: about.title,
          description: about.description,
          front_img_url: about.Front_img_url,
          back_img_url: about.back_img_url,
        },
      };
      const result = await AboutUsCollections.updateOne(filter, updateDoc);
      console.log(result);
      res.send(result);
    });

    // ***************************************************************************************************
    //                                       banner API's Hare
    // ***************************************************************************************************
    // post a carousel
    app.post("/carousels", async (req, res) => {
      const cursor = req.body;
      console.log(cursor);
      const result = await carouselCollections.insertOne(cursor);
      // console.log(result);
      res.send(result);
    });
    // get all carousel
    app.get("/carousels", async (req, res) => {
      const query = carouselCollections.find();
      const result = await query.toArray();
      res.send(result);
    });
    // update carousel
    app.get("/carousels/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await carouselCollections.findOne(filter);
      console.log(result);
      res.send(result);
    });
    // update the carousel
    app.put("/carousels/:id/", async (req, res) => {
      const id = req.params.id;
      const carousel = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: carousel.title,
          img_url: carousel.img_url,
          discription: carousel.discription,
        },
      };
      const result = await carouselCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // Delete a carousel
    app.delete("/carousels/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carouselCollections.deleteOne(query);
      res.send(result);
    });

    //**************************************************************************************************
    //                                       Service API's Hare
    //*************************************************************************************************

    // post a service

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log("This app listing to port", port);
});
