const express = require('express')
const app = express()
const cors = require('cors');
const admin = require("firebase-admin");
require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;



const serviceAccount = require('./marufmanagementaist-firebase-admin.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jcoi8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function verifyToken(req, res, next) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];

    try {
      const decodedUser = await admin.auth().verifyIdToken(token);
      req.decodedEmail = decodedUser.email;
    }
    catch {

    }

  }
  next();
}

async function run() {
  try {
    await client.connect();
    const database = client.db("Speed-Up");
    const usersCollection = database.collection('users');
    const studentsCollection = database.collection('students');

    //get team students
    app.get('/students', async (req, res) => {
      const cursor = studentsCollection.find({});
      const student = await cursor.toArray()
      res.send(student)
    });

    // post team members
    app.post('/students', async (req, res) => {
      const student = req.body;
      const result = await studentsCollection.insertOne(student);
      console.log('hitting the teammember', req.body);
      console.log('got user', result);
      res.json(result);
    })
    // get single students

    // app.get('/students/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectID(id) };
    //   const student = await studentsCollection.findOne(query);
    //   res.json(student);
    // })

    app.get('/students/id/:id', async (req, res) => {
      const cursor = studentsCollection.find({});
      const student = await cursor.toArray()
      const search = req.params.id;
      if(search){
        const result = student.filter(students => students._id == search);
        res.json(result)
      }
     else{
      res.json(student);
     }
    })

    app.get('/students/:key', async (req, res) => {
      const cursor = studentsCollection.find({});
      const student = await cursor.toArray()
      const search = req.params.key;
      if(search){
        const result = student.filter(students => students.firstName.toLocaleLowerCase().includes(search));
        res.json(result)
      }
     else{
      res.json(student);
     }
    })
    app.get('/students/lastname/:key2', async (req, res) => {
      const cursor = studentsCollection.find({});
      const student = await cursor.toArray()
      const search = req.params.key2;
      if(search){
        const result = student.filter(students => students.registrationNo.toLocaleLowerCase().includes(search));
        res.json(result)
      }
     else{
      res.json(student);
     }
    })
   
    // delete single students
    app.delete('/students/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const student = await studentsCollection.deleteOne(query);
      res.send('student');
    })

    app.put('/students/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const student = req.body;
      const filter = { _id: ObjectID(id) };
      const options = { upsert: true };
      const updateDoc = { $set: student };
      const result = await studentsCollection.updateOne(filter, updateDoc, options);
      res.json(result);
  });

















    //get api
    app.get('/posts', async (req, res) => {
      const cursor = usersPpostCollection.find({});
      const post = await cursor.toArray()
      res.send(post)
    });
    //get api
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find({});
      const user = await cursor.toArray()
      res.send(user)
    });

    //get user by email
    app.get('/users', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      console.log(query);
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray()
      res.send(users)
    });





















    // post api
    app.post('/posts', async (req, res) => {
      const posts = req.body;
      const result = await usersPpostCollection.insertOne(posts);
      console.log('hitting the post', req.body);
      console.log('got user', result);
      res.json(result);
    })



    //get cars
    app.get('/cars', async (req, res) => {
      const cursor = carsCollection.find({});
      const car = await cursor.toArray()
      res.send(car)
    });

    // post cars
    app.post('/cars', async (req, res) => {
      const car = req.body;
      const result = await carsCollection.insertOne(car);
      console.log('hitting the car', req.body);
      console.log('got user', result);
      res.json(result);
    })

    // get single CAR

    app.get('/cars/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const car = await carsCollection.findOne(query);
      res.json(car);
    })
    // delete single car
    app.delete('/cars/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const car = await carsCollection.deleteOne(query);
      res.json(car);
    })

    // get orders by email
    // app.get('/orders', async (req, res) => {
    //   const email = req.query.email;
    //   console.log(req.query);
    //   const query = { email: email}
    //   const cursor2 = ordersCollection.find(query);
    //   const order2 = await cursor.toArray();
    //   res.json(order2);
    // })



    // get orders
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    })
    // })
    // app.get('/orders', async (req, res) => {
    //   const email = req.query.email;
    //   console.log(req.query);
    //   const query = { email: email }
    //       const cursor = ordersCollection.find(query);
    //   const order = await cursor.toArray();
    //   res.json(order);

    // })

    // get single order

    app.get('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const order = await ordersCollection.findOne(query);
      res.json(order);
    })

    // post orders 
    app.post('/orders', async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    })

    app.get('/cars', async (req, res) => {
      console.log(req.body);
      res.send('okay')
    })
    // update Order
    app.put('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const updatedOrder = req.body;
      const filter = { _id: ObjectID(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          orderStatus: updatedOrder.orderStatus
        },
      };
      const result = await ordersCollection.updateOne(filter, updateDoc, options)
      console.log('updating order ', id);
      res.json(result);
    })

    //get reviews
    app.get('/reviews', async (req, res) => {
      const cursor = reviewsCollection.find({});
      const review = await cursor.toArray()
      res.send(review)
    });

    // post reviews
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      console.log('hitting the review', req.body);
      console.log('got user', result);
      res.json(result);
    })
    // get single reviews

    app.get('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const review = await reviewsCollection.findOne(query);
      res.json(review);
    })

    // delete single reviews
    app.delete('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const review = await reviewsCollection.deleteOne(query);
      res.json(review);
    })
    // delete single order
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const order = await ordersCollection.deleteOne(query);
      res.json(order);
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    })

    app.post('/users', verifyToken, async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    app.put('/users', verifyToken, async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });










    //j kew admin banaite parbe

    app.put('/users/admin', verifyToken, async (req, res) => {
      const user = req.body;
      const requester = req.decodedEmail;
      if (requester) {
        const requesterAccount = await usersCollection.findOne({ email: requester });
        if (requesterAccount.role === 'admin') {
          const filter = { email: user.email };
          const updateDoc = { $set: { role: 'admin' } };
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result);
        }
      }
      else {
        res.status(403).json({ message: 'you do not have access to make admin' })
      }

    })

  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello ManageAist')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})