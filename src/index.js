
// const express = require('express');
// require('./db/connection');
// // nothing is extracted from connection.js,  we require() this file so that it runs and make sure mongoose is connected to database
// const User = require('./models/user');
// const Task = require('./models/Task');
// const { response } = require('express');

// const app = express();

// app.use(express.json());
// // this converts any json data incoming into object to be used after    

// const port = process.env.PORT || 3000;
// // app is to be deployed to heroku so first check in .env file for PORT 
// // heroku automatically assigns it  else if we are in development mode , 
// // port 3000 is considered 






// // by default express sets the status to 200  whenever something is sent back to client
// // post request data is carried by request body.. which we pass using postman and with JSON data
// app.post('/users', (req, res)=>{
//     const user = new User(req.body);

//     user.save().then((result)=>{
//         // most appropriate status code is 201 which means created
//         res.status(201).send(result);
//     }).catch(error => {
//         // status code is still 200 even if there is some error.
//         // we need to manulally change it before sending the response..
//        // res.send(error);
//         // res.status(400);
//         // res.send(error);
//         res.status(400).send(error);


//     });
// })

// // reading endpoint mostly called in two ways 
// // reading data based on id  ie. receiving a single document 
// // reading multiple documents 

// app.get('/users', (req, res)=>{
//     User.find({})
//         .then(users =>{
//             res.send(users);
//         })
//         .catch(error => {
//             response.status(500).send();
//         })
// })

// app.get('/users/:id', (req, res)=>{
//     const _id = req.params.id;

//     User.findById(_id)
//         .then(result =>{
//             if(!result){
//                 return res.status(404).send();
//                 // mongodb don't send error if nothing is found, it sends nothing
//             }
//             res.send(result);
//         })
//         .catch(error=>{
//             res.status(400).send(error);
//         })
// })









// // end points for tasks 
// app.post('/tasks', (req, res)=>{
//     const task = new Task(req.body);

//     task.save().then(result=>{
//         res.status(201).send(result);
//     }).catch(e=>{
//         res.status(400).send(e);
//     })
// })

// app.get('/tasks', (req, res)=>{
//     Task.find({})
//         .then(result=>{
//             res.send(result);
//         })
//         .catch(error =>{
//             res.status(400).send(error);
//         })
// })


// app.get('/tasks/:id', (req,res)=>{
//     Task.findById(req.params.id)
//         .then(result=> {
//             if(!result)
//              res.status(404).send();

//             res.send();
//         })
//         .catch(error=>{
// // if document with same id is not found mongodb don't send error it sends an empty object which we have handeled as status 404 not found  , above
//             res.send(error);
//         })
// })





// app.listen(port, ()=>{
//     console.log('server is up on port  '+ port);
// })



































// //..........................................................


// const express = require('express');
// require('./db/connection');
// const User = require('./models/user');
// const Task = require('./models/Task');
// const { response, json } = require('express');

// const app = express();

// app.use(express.json());

// const port = process.env.PORT || 3000;


// app.post('/users', async (req, res) => {
//     const user = new User(req.body);
//     res.status(201).send(user);
//     try {
//         await user.save();
//     } catch (e) {
//         res.status(400).send(e);
//     }



// });



// app.get('/users', async (req, res) => {
    
//    try{
//        const users = await User.find({});
//        res.send(users);
//    }catch(error){
//        res.status(500).send(error);
//    }
// })

// app.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;

//     try{
//         const user = await User.findById(_id);
//         if(!user)
//          return res.status(404).send();

//         res.send(user);
//     }catch(error){
//         res.status(400).send(error);
//     }

// })

// // patch is used for updating, if we are trying to update something which is not the property
// // of the document object  , it is complately ignored.. but still status of response is 200 by default 
// // to change it we need to check whether every property in req.body is a subset of properties of user document 
// app.patch('/users/:id',async (req, res)=>{

//     const updates = Object.keys(req.body);
//     // updates is array of keys ie. property names in req.body.
//     const allowedUpdates = ['name','email','password','age']
//     const isValid = updates.every(update=> allowedUpdates.includes(update));
//     // every() returns true if each update callback function returns true else it returns false 
    
//     if(!isValid)
//      return res.status(400).send('error: invalid update parameter');

//     try{
//         const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true});
//         // updates are passed in request body ,in options object  new:true states that const user contains the new value ot document , 
//         // runValidators: true  states that validation should be run on the new data updated... 
//         if(!user)
//          return res.status(404).send();
         
//         res.send(user);
//     }catch(error){
//         res.status(400).send(error);
//     }
// })

// app.delete('/users/:id', async (req, res)=>{
//     try{
//         const user = await User.findByIdAndDelete(req.params.id);
//         if(!user)
//          res.status(404).send('error: no document found with the id');

//          res.send(user);
//     }catch(e){
//         res.status(500).send(e);
//     }
// })






// // end points for tasks 
// app.post('/tasks', async (req, res) => {
//     const task = new Task(req.body);
//     try{
//         const result = await task.save();
//         res.status(201).send(result);
//     }catch{e => res.status(400).send(e)};
  
// })

// app.get('/tasks',async (req, res) => {
//     try{
//         const tasks = await Task.find({});
//         res.send(tasks);
//     }catch{e => res.status(400).send(e)};

// })


// app.get('/tasks/:id',async (req, res) => {
//     try{
        
//         const task = await Task.findById(req.params.id);
        
//         if(!task)
//          return res.status(404).send();
//         res.send(task);
//     }catch{e => res.status(400).send(e)}
    
// })

// app.patch('/tasks/:id', async (req, res)=>{
//     const allowedUpdates = ['description','completed'];
//     const updates = Object.keys(req.body);
//     const isValid = updates.every(update=> allowedUpdates.includes(update));

//     if(!isValid)
//      return res.status(400).send('error: invalid update parameter');

//     try{
//         const task = await Task.findById(req.params.id, req.body,{new:true, runValidator:true});
//         if(!task)
//          return res.status(404).send();
        
//         res.send(task);

//     }catch(e){
//         res.status(400).send(e)
//     };
// })

// app.delete('/tasks/:id',async (req,res)=>{
//     try{
//     const task = await Task.findByIdAndDelete(req.params.id);
//     if(!task)
//      return res.status(400).send()

//     res.send(task);

//     }catch(e){
//         res.status(400).send(e);
//     }

// })


// app.listen(port, () => {
//     console.log('server is up on port  ' + port);
// })






























// //.................... using routers ................

// // as we see before .. adding more functionality/ routes 
// // increases the size of the index.js file.. so it's better 
// // to handle related functions separately.. to stay organized 

// // Router is used for routing , and we have access to all the route functions
// // like get delete post patch etc... 
// // we can use router separately for related routes 
// // we can have a router for user routes, and another for tasks routes 
// // similar to express it doesn't take arguments .. it gives access to funcitons 
// // which helps in configuring ..
// // we need to register the router using app.use router..


// const express = require('express');
// require('./db/connection');
// const bcrypt = require('bcrypt');

// const userRouter = require('./router/userRoutes');
// const taskRouter = require('./router/taskRoutes');

// const app = express();
// const port = process.env.PORT || 3000;


// // app.use((req,res,next)=>{
// //     console.log(req.method,req.path);
// //     if(req.method === 'GET'){
// //         res.send('GET  requests  are disabled');
// //     }else{
// //         next();
// //     }
// //     next();
// //     // next() is called to make express know that we are done with our middleware
// //     // else it will hang and control stays here thinking that we haven't finished yet the middleware 

// // })



// app.use(express.json());
// app.use(userRouter);
// app.use(taskRouter);



// app.listen(port, () => {
//     console.log('server is up on port  ' + port);
// })


// trials ...........

// const myfunction = async ()=>{
//     const password = 'Suraj123';
//     const hashedPassword = await bcrypt.hash(password,8);
//     // bcrypt.hash(plain text password,  number of hash rounds)
//     // it takes time and returns a promise.. so  we can use async and await here to handle the promise 
//     // encryption algorithms are those from which we can get back the original password...
//     // password ---encrypt---->  a;lsidgj;aoeih ---decrypt--->  password 
//     // hashed passwords are one way 
//     // password ---hash---> a;lsigh;oaioaej  no way back 

//     console.log(password);
//     console.log(hashedPassword);
//     // to check whether password matches .. we hash it and check it with hashed password which is stored in db 
//     const isMatch = await bcrypt.compare('Surajdst123', hashedPassword);
//     console.log(isMatch);
// }
// myfunction();





// //.................................

// const jwt = require('jsonwebtoken');

// const myFunction = ()=>{

//     // jwt.sign({payload object}, 'secret string') returns token which can be used by the user to make the server know that he is authorized
//     // payload object is data to be embeded within the token.. user id is fine.. 
//     // it is to be hashed with a secret string which will generate some random set of characters.. if the token is tampered .. hasing again won't result in same value 
//     const token = jwt.sign({_id: 'abc123'}, 'mysecretkeyisthis',{expiresIn: '1 second'});
//     console.log(token);
//     const data = jwt.verify(token,'mysecretkeyisthis')
//     console.log(data);
// }

// myFunction();




// //...........................toJSON...............
// // this concept we have used in user model
// // behind the scene express uses JSON.stringify() to send the response 
// // stringify() output can be manipulated by the returned value of toJSON()

// const pet = {
//     name: 'Hat'
// }

// // when we do res.send() express calls JSON.stringify() behind the scene 
// // pet.toJSON = function(){
// //     console.log(this);
// //     return this;
// // }

// // when we apply JSON.stringify(obj)... it stringifies the value returned from 
// // obj.toJSON()  we can manipulate the stringify() output from inside of this function 

// console.log(JSON.stringify(pet));

// pet.toJSON = function (){
//     console.log(this);
//     // outout is { name: 'Hat', toJSON: [Function (anonymous)] }
//     return {nickName: 'suraj'};
//     // after defining this funciton if we call JSON.stringigy(pet) 
//     // output wil be {"nickName":"suraj"}
// }



// console.log(JSON.stringify(pet));








// //  .......... owner of the task .......................

// // if i am deleting a task in the database i should be the one who created it

// const Task = require('./models/task');



// const main = async ()=>{
//     const task = await Task.findById('61ed5fe6b19a1526b40bd306');
//     // console.log(task.owner);
//     // now to find the user data we again have to call it manually..  find by id 
//     // with mongoose we can do it with minimal code...  in owner field of Task model 
//     // make  ref: 'User' User is the model name of users in mongoose that we have created 
//     // now we can populate the owner field of Task with the entire user profile 
//     await task.populate('owner');
//     // execute ppulate
//     console.log(task.owner);
// }

// main();







// //...........  user's  tasks ................
// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async ()=> {
//     const user = await User.findById('61ed6d36862f3dceb431a9ce');
//     await user.populate('myTasks');
//     console.log(user.myTasks);
//     // user didn't have tasks...
//     // we  won't actually store all tasks in database... like tokens array of users 
//     // we 'll use virtual property.. which is a relationship between two entities  users and tasks 

// }

// main();











//...................  file uploads .....................
// multer.. npm package 

require('dotenv').config()
const express = require('express');
require('./db/connection');



const userRouter = require('./router/userRoutes');
const taskRouter = require('./router/taskRoutes');

const app = express();
const port = process.env.PORT || 3000;



// const multer = require('multer');
// const upload = multer({
//     dest:'fileUploads',
//     // destination path (from where this program runs) where the uploaded file is going to be saved.
//     limits:{
//         fileSize: 1000000
//         // set limit on fileSize in bytes. .. here 1mb
//     },
//     // filter out files which ew don't want to something to be uploaded
//     // go to api section of multer npm package. see under file section what are the 
//     // properties available with the file object
//     fileFilter: (req,file,cb)=>{
//         // cb callback which can be called in three ways, file info and req are automatically passed by multer
        
//         // if(!file.originalname.endsWith('.pdf')){
//         //     return cb(new Error('Please upload a PDF'))
//         // }

// // if we try to support upload for .doc and .docx  and some other files extensions 
// // we can do it using array and or operator in loop or we can use regx
// // regx101.com  match() allows to provide regular expression inside //
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload a word document'));
//         }

//         // if things went well
//         cb(undefined, true);
        
//         // in case of error
//         // cb(new Error('File must be a PDF'));
//         // nothing went wrong
//         // cb(undefined,true)
//         // cb(undefined, false) // reject the upload
//     }
// })


// // multer provides a middlewire which helps adding support file upload.. upload.single('name for upload')
// // node by default doesn't support file uploads 
// // here we are saying multer to look for a file called upload_1 when the request comes in
// // in postman we can send the file using form-data  key should be same as the file 
// // multer middleware is looking for (upload_1)  and value is the file we want to send

// app.post('/upload',upload.single('upload_1'), (req, res)=>{
//     res.send();
//  })



//................... handling error in express ...............
// upload.single() middleware throws error using the cb() provided in fileFilter
// but we are sending the res simply be res.send() which shows irrelevant info. to user 
// to handle errors in express we pass another callback function (error, req,res,next)=>{}
// all four arguments are to be taken so that express knows this function is for handling errors 

// const errorMiddleware = (req,res,next)=>{
//     throw new Error('from error middleware ');
// }

// app.post('/upload', errorMiddleware, (req,res)=>{
//     res.send();
// }, (error, req,res,next)=>{
//     res.status(400).send({error : error.message});
// })



 // // one error can happen, visual studio isn't able to display the image.. this has to do with 
// // the file extention.. it is randomly generated by default and the data is binary .. we need to rename..
// // to jpg let say





app.use(express.json());
app.use(userRouter);
app.use(taskRouter);



app.listen(port, () => {
    console.log('server is up on port  ' + port);
})

