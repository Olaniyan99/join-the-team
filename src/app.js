

var express = require ('express');
var app = express();

var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var bodyParser = require ('body-parser');

const mongoose = require('mongoose');



//MiddleWare
app.use(bodyParser.json())

//CORS Middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var url = 'mongodb://root:example@localhost:27017';

router.get('/lists', async (req, res) => {
  const resultArray = [];
  mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async function (db, client){
    var cursor = await client.db('task-service').collection('categories').find().toArray();
    console.log(cursor)
    res.send(cursor)
  });
});

router.post('/lists', async (req, res) => {
  var myobj = {
    name: req.body.name,
  }
  mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  }, async function (db, client){
    var result = await client.db('task-service').collection('categories').insert(myobj, function(err, result){
      if(result){
        res.send('Sucesss');
      }
      if(err){
        res.send('Error');
      }
    });
  });
});

router.patch('/lists/:id', function(req, res) {
  const myobj = {
    name: req.body.name, 
  };
  const id = req.params.id;

  mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  }, async function (db, client){
    var result = await client.db('task-service').collection('categories').updateOne({"_id": objectId(id)},{$set:myobj}, function(err, result){
      if(result){
        res.send('Item Updated');
      }
      if(err){
        res.send('Error');
      }
    });
  });
});

router.delete('/lists/:id', function(req, res, db) {
  const id = req.params.id;
  mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  }, async function (db, client){
    var result = await client.db('task-service').collection('categories').deleteOne({"_id": objectId(id)}, function(err, result){
      if(result){
        res.send('Item Deleted');
      }
      if(err){
        res.send('Error');
      }
    });
  });
});  

router.get('/lists/:listId/tasks', async (req, res) => { // get all tasks that belong to a specific list (specified by listId)
  const listId = req.params.listId;
  const resultArray = [];
  mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async function (db, client){
    var cursor = await client.db('task-service').collection('categories').findOne({"_id":objectId(listId)})
    console.log(cursor.tasks)
    if(cursor.tasks){
      for(let i = 0; i < cursor.tasks.length; i++){
        let taskId = cursor.tasks[i];
        var task = await client.db('task-service').collection('tasks').findOne({"_id": objectId(taskId)});
        resultArray.push(task);
      }
    }
    console.log(resultArray);
    res.send(resultArray);
  });
});

router.post('/lists/:listId/tasks', async (req, res) => { // Create a new task in a list specified by listId.
  const listId = req.params.listId;
  const obj = {
    text: req.body.text,
    completed: req.body.completed,
  }
  mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  }, async function (db, client){
    var task = await client.db('task-service').collection('tasks').insertOne(obj);
    console.log(task);
    var cursor = await client.db('task-service').collection('categories').findOneAndUpdate({"_id": objectId(listId)}, {$push:{"tasks": `${task.insertedId}`}});
    res.send(cursor);
  });
});

router.patch('/lists/:listId/tasks/:taskId', async (req, res) => { // Update an existing list in a specific list.
  const listId = req.params.listId;
  const taskId = req.params.taskId;
  const obj = {
    text: req.body.text,
    completed: req.body.completed,
  }
  mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  }, async function (db, client){
    var task = await client.db('task-service').collection('tasks').updateOne({"_id": objectId(taskId)}, {$set:obj});
    console.log(task);
    res.send(task);
  });
});

router.delete('/lists/:listsId/tasks/:taskId', async (req, res) =>{ //delete task in a specific List.
  const taskId = req.params.tasks;
  mongo.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, async function (db, client){
   var result = await client.db('task-service').collection('tasks').deleteOne({"_id": objectId(taskId)});
    var cursor = await client.db('task-service').collection('categories').remove({"tasks": objectId(taskId)});
    console.log(cursor);
    res.send(result);
    res.send(cursor);
  });
});

// router.delete('/lists/:listId/tasks/:taskId', function(req, res,) {
//   const listId= req.params.listId;
//   const taskId = req.params.id;

//   mongo.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  }, async function (db, client){
//     var result = await client.db('task-service').collection('tasks').deleteOne({"_id": objectId(taskId)});
//     var cursor = await client.db('task-service').collection('categories').update({"_id": objectId(listId)}, {$pull : {"tasks": "5e0890382b2f764859d95cd0"}}, function(err, result){
//       if(result){
//         res.send("Item was deleted from List");
//       }
//       if(err){
//         res.send("Error deleting task from List");
//       }
//     res.send(cursor);
//     });
//   });
// });  

app.use(router);
module.exports = router;

app.listen(3000);
