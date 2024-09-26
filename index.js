const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
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
    //                                       Service API's Hare
    // ***************************************************************************************************
    const { ObjectId } = require("mongodb");
    // Jwt
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res
        .cookie(token, {
          httpOnly: true,
          secure: false,
          sameSite: "none",
        })
        .send({ success: true });
    });
    // Services API
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find().toArray(); // Directly call toArray() on the collection
      res.send(result);
    });

    app.post("/services", async (req, res) => {
      const service = req.body; // Renamed variable for clarity
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    // Booking API
    app.get("/bookings", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      // Remove incorrect $set usage
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    // Campaign API
    app.get("/campaign", async (req, res) => {
      const result = await campaignCollections.find().toArray();
      res.send(result);
    });

    app.post("/campaign", async (req, res) => {
      const campaign = req.body; // Renamed variable for clarity
      const result = await campaignCollections.insertOne(campaign);
      res.send(result);
    });

    // About Us API
    app.post("/about", async (req, res) => {
      const aboutInfo = req.body; // Renamed variable for clarity
      const result = await AboutUsCollections.insertOne(aboutInfo);
      res.send(result);
    });

    app.get("/about", async (req, res) => {
      const result = await AboutUsCollections.find().toArray();
      res.send(result);
    });

    app.put("/about/:id", async (req, res) => {
      // Updated route to include :id
      const id = req.params.id;
      const about = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: about.title,
          description: about.description,
          front_img_url: about.front_img_url, // Fixed inconsistent naming
          back_img_url: about.back_img_url,
        },
      };
      const result = await AboutUsCollections.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Banner/Carousel API
    app.post("/carousels", async (req, res) => {
      const carousel = req.body; // Renamed variable for clarity
      const result = await carouselCollections.insertOne(carousel);
      res.send(result);
    });

    app.get("/carousels", async (req, res) => {
      const result = await carouselCollections.find().toArray();
      res.send(result);
    });

    app.get("/carousels/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await carouselCollections.findOne(filter);
      res.send(result);
    });

    app.put("/carousels/:id", async (req, res) => {
      const id = req.params.id;
      const carousel = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: carousel.title,
          img_url: carousel.img_url,
          description: carousel.description, // Fixed spelling mistake "discription" to "description"
        },
      };
      const result = await carouselCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

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
