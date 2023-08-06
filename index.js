const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

//middlewares

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ss5j1ke.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //!Gallery

    const galleryCollection = client.db("ToyTopia").collection("galleryImages");

    app.get("/gallery", async (req, res) => {
      const cursor = galleryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //!Catgory

    const categoryCollection = client.db("ToyTopia").collection("categories");

    app.get("/category", async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //!Most Popular

    const mostPopularCollection = client
      .db("ToyTopia")
      .collection("mostPopular");

    app.get("/popular", async (req, res) => {
      const cursor = mostPopularCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //!AllToy

    const allToysCollection = client.db("ToyTopia").collection("allToys");

    app.get("/alltoy", async (req, res) => {
      const cursor = allToysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //!AllToy Details

    app.get("/alltoy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: {
          name: 1,
          sellerEmail: 1,
          picture: 1,
          detailDescription: 1,
          rating: 1,
          price: 1,
          quantity: 1,
          detailDescription: 1,
          seller : 1 
        },
      };
      const result = await allToysCollection.findOne(query,options);
      res.send(result);
    });


    //!AddCoffe 

    const newToysCollection = client.db("ToyTopia").collection("newToys")

    app.post("/toys" , async (req , res) => {
        const newToy = req.body;
        const result = await newToysCollection.insertOne(newToy)
        res.send(result);
        console.log(newToy);
    })

    app.get("/toys" , async (req , res) => {
        console.log(req.query.email);
        let query = {};
        if(req.query?.email){
            query = {email:req.query.email}
        }

         const cursor = newToysCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.delete("/toys/:id" , async(req , res) => {
         const id = req.params.id;
         const query =  {_id : new ObjectId(id)}
         const result = await newToysCollection.deleteOne(query)
         res.send(result);
    })

    app.get("/toys/:id" , async(req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await newToysCollection.findOne(query);
        res.send(result)
    })


    app.put("/updatetoy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = req.body;
      const toy = {
        $set: {
          name: updatedToy.name,
          price: updatedToy.price,
          rating: updatedToy.rating,
          quantity: updatedToy.quantity,
          detailDescription: updatedToy.detailDescription,
          sellerEmail: updatedToy.sellerEmail,
          sellerName: updatedToy.sellerName,
          subCategory: updatedToy.subCategory,
          photo: updatedToy.photo,
        },


      };
      const result = await newToysCollection.updateOne(filter, toy, options);
      res.send(result);
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("The ToyTopia is open !");
}) ;

app.listen(port, () => {
  console.log(`ToyTopia server is runnig at port ${port}`);
});
