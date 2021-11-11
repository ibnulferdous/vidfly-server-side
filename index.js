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
        const usersCollections = database.collection("users");

        // Registed users- POST API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollections.insertOne(user);

            res.json(result);
        });

        


        
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