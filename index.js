const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kavnp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        console.log('databse connected');
        const companyCollection = client.db('digiBazz').collection('companies');
        const buyerCollection = client.db('digiBazz').collection('buyers');

        app.get('/company',  async (req, res) => {
            const companies = await companyCollection.find().toArray();
            res.send(companies);
        });
        app.put('/company/:email', async (req, res) => {
            const email = req.params.email;
            const company = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: company,
            };
            const result = await companyCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
        app.get('/buyer',  async (req, res) => {
            const buyer = await buyerCollection.find().toArray();
            res.send(buyer);
        });
        app.put('/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const buyer = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: buyer,
            };
            const result = await buyerCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
    }
    finally{

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('digiBazz');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})