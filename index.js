const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;



const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jg5bl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {

    try {
        await client.connect();
        const database = client.db('HandiCraftData');
        const handiCraftCollection = database.collection('AllHandiCraft');
        const adminCollection = database.collection('Admins');
        const reviewsCollection = database.collection('Reviews');
        const ordersCollection = database.collection('Orders');



        //Add Product api
        app.post('/AllHandiCraft', async (req, res) => {
            const allHandiCraft = req.body;
            console.log('hit the post api', allHandiCraft);
            const result = await handiCraftCollection.insertOne(allHandiCraft);
            console.log(result);
            res.json(result);
        });



        //get product api
        app.get('/AllHandiCraft', async (req, res) => {
            const cursor = handiCraftCollection.find({});
            const AllHandiCraft = await cursor.toArray();
            res.send(AllHandiCraft);
        });

        //Delete Product api
        app.delete('/AllHandiCraft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await handiCraftCollection.deleteOne(query);
            console.log('deleting user with id', result)
            res.json(result);
        });

        //Add Admin api
        app.post('/Admins', async (req, res) => {
            const admins = req.body;
            console.log('hit the post api', admins);
            const result = await adminCollection.insertOne(admins);
            console.log(result);
            res.json(result);
        });



        //Add review api
        app.post('/Reviews', async (req, res) => {
            const reviews = req.body;
            console.log('hit the post api', reviews);
            const result = await reviewsCollection.insertOne(reviews);
            console.log(result);
            res.json(result);
        });

        //get REview api
        app.get('/Reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const Reviews = await cursor.toArray();
            res.send(Reviews);
        });


        //get Admin api
        app.get('/Admins', async (req, res) => {
            const cursor = adminCollection.find({});
            const Admins = await cursor.toArray();
            res.send(Admins);
        });


        //User Order api
        app.post('/Orders', async (req, res) => {
            const orders = req.body;
            console.log('hit the post api', orders);
            const result = await ordersCollection.insertOne(orders);
            console.log(result);
            res.json(result);
        });

        //get User Order api
        app.get('/Orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const Orders = await cursor.toArray();
            res.send(Orders);
        });
        //Delete Orders api
        app.delete('/Orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log('deleting user with id', result)
            res.json(result);
        });


        //Update Status API 

        app.put('/Orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options);
            console.log(`your id nong`, id, updatedStatus);
            res.send(result)
        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('handy craft server is running')
});


app.listen(port, () => {
    console.log('server running at port', port);
})