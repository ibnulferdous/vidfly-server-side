const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dh7kk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("vidflyDB");
        const dronesCollection = database.collection("drones");
        const usersCollections = database.collection("users");
        const ordersCollection = database.collection("orders");
        const reviewsCollection = database.collection("reviews");


        // Drones- GET API for all
        app.get('/drones', async (req, res) => {
            const cursor = dronesCollection.find({});
            const drones = await cursor.toArray();
            res.send(drones);
        })

        // Drones- GET API for one drone
        app.get('/drones/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const drone = await dronesCollection.findOne(query);
            res.json(drone);
        })

        // Drones- POST API
        app.post('/drones', async (req, res) => {
            const drones = req.body;
            const result = await dronesCollection.insertOne(drones);

            res.json(result);
        });

        // Drones- DELETE API
        app.delete('/drones/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await dronesCollection.deleteOne(query);

            res.json(result);
        })




        // ------------------------------------------------------------------

        // Users- GET API for all
        app.get('/users', async (req, res) => {
            const cursor = usersCollections.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        // Users- POST API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollections.insertOne(user);

            res.json(result);
        });

        // Users- UPDATE API
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: false };

            const updateStatus = {
                $set: {
                    role: `admin`
                },
            };

            const result = await usersCollections.updateOne(filter, updateStatus, options);

            res.json(result);
        })

        // User- POST API to find data by email
        app.post('/users/by-email', async (req, res) => {
            const userEmail = req.body;
            const query = { email: { $in: userEmail } };
            const user = await usersCollections.find(query).toArray();
            res.json(user);
        })




        // ------------------------------------------------------------------

        // Orders- GET API for all
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // Orders- POST API
        app.post('/orders', async (req, res) => {
            const order = req.body;

            const result = await ordersCollection.insertOne(order);

            res.json(result);
        });

        // Orders- POST API to find data by email
        app.post('/orders/by-email', async (req, res) => {
            const userEmail = req.body;
            const query = { email: { $in: userEmail } };
            const ordersByUser = await ordersCollection.find(query).toArray();
            res.json(ordersByUser);
        })

        // Orders- UPDATE API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: false };

            const updateStatus = {
                $set: {
                    orderStatus: `shipped`
                },
            };

            const result = await ordersCollection.updateOne(filter, updateStatus, options);

            res.json(result);
        })

        // Orders- DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);

            res.json(result);
        })




        // ------------------------------------------------------------------

        // Reviews- POST API
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);

            res.json(result);
        });

        // Reviews- GET API for all
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })



        


        
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Vidfly- Server running...')
})

app.listen(port, () => {
    console.log(`Listening at ${port}`)
})