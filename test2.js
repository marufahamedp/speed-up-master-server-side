const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const port = 5000;
app.use(cors());
app.use(express.json());
app.get('/', (req, res)=>{
    res.send('running my curd server');
})



const uri = "mongodb+srv://mydbuser1:WrvbrZzTdHfz1Hq3@cluster0.jcoi8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("insertDB");
      const usersCollection = database.collection("haiku");
      const usersPpostCollection = database.collection("posts");
      //get api

      app.get('/users', async(req, res)=>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray()
        res.send(users) 
      });
      app.get('/posts', async(req, res)=>{
        const cursor = usersPpostCollection.find({});
        const post = await cursor.toArray()
        res.send(post) 
      });


      app.get('/users/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id:ObjectID(id)};
          const user = await usersCollection.findOne(query);
          console.log('load user with id', id);
          res.send(user);
      })

      // post api
      app.post('/users', async (req, res) => {
          const newUser = req.body;
          const result = await usersCollection.insertOne(newUser);
        console.log('hitting the post', req.body);
        console.log('got user', result);
        res.json(result);
      })
      // post api
      app.post('/posts', async (req, res) => {
          const newUser = req.body;
          const result = await usersPpostCollection.insertOne(newUser);
        console.log('hitting the post', req.body);
        console.log('got user', result);
        res.json(result);
      })

      // update users
      app.put('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = {_id:ObjectID(id)};
        const options = {upsert:true};
        const updateDoc = {
          $set:{
            name: updatedUser.name,
            email: updatedUser.email
          },
        };
        const result = await usersCollection.updateOne(filter, updateDoc, options)
        console.log('updating user ', id);
        res.json(result);
      })


      //delete users
      app.delete('/users/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id:ObjectID(id)};
          const result = await usersCollection.deleteOne(query)
          console.log('Deleting user with id', id);
          res.json(result);
      })
      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);






app.listen(port, () =>{
    console.log('Running server on port', port);
})