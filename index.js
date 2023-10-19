const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3300;

// MIddleware configuration
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAMEUSER}:${process.env.DB_PASSCODE}@cluster0.7dbji.mongodb.net/?retryWrites=true&w=majority`;
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

    const productsDB = client.db("BrandDB").collection("products");
    const brandsDB = client.db("BrandDB").collection("brands");

    app.get("/products", async (req, res) => {
      const cursor = productsDB.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const products = req.body;
      const result = await productsDB.insertOne(products);
      res.send(result);
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsDB.findOne(query);
      res.send(result);
    });

    app.get("/brands", async (req, res) => {
      const cursor = brandsDB.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/brands/:name", async (req, res) => {
      const brand = req.params.name;
      const query = { brand: brand };
      const cursor = productsDB.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//
//
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
