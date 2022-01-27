// // CRUD  create read update delete 
// // mongodb is the native driver

// const {MongoClient, ObjectID} = require('mongodb');

// // MongoClient gives us functions necessary to 
// // be able to connect to database and perform crud operations

// // ObjectID is the constructor which generates GUID
// const id = new ObjectID();
// // we can pass this as _id: id   for a document which we want to save in mongodb

// console.log(id);
// console.log(id.getTimestamp());
// console.log('binary length: ' , id.id.length);
// console.log('hex string length',id.toHexString().length );
// // id in string format consumes more length than binary id (which is actually stored as id  ie. id property of the object id)
// // in robo 3 we can see that key is not the id in string format..
// // instead it is a function call ObjectID('id in string format') which returns the binary




// const connectionURL = 'mongodb://127.0.0.1:27017';
// // mongodb://  we are using their protocol , instead of using localhost we used 127.0.0.1 
// // as localhost caused some problems, 27017 is the default port for mongodb
// const databaseName = 'task-manager';

// // even though we called connect once there are pool of connections behind 
// MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client)=>{
//     if(error){
//        return console.log('unable to connect to database !');
//     }

//     console.log('connected successfully');
//     // returns reference to the database we are about to manipulate 
//     // if name is not specified, it is created automatically
//     const db = client.db(databaseName);
//     // before inserting we need to know on which collection we are operating 
    
//     db.collection('users').insertOne({
//         _id: id ,
//         name: 'suraj',
//         age: 19
//     },(error, result)=>{
//         if(error){
//             return console.log('Unable to insert User');
//         }

//         console.log(result);
//         // ops property array of documents  
//     })
//     // collection(collection name ), asynchronous insertOne(data obj, callback)

//     // db.collection('users').insertMany([
//     //     {name: 'Jen',age:34}, {name: 'tanya',age: 24}
//     // ], 
//     // (error, result)=>{
//     //     if(error){
//     //         return console.log('Unable to insert documents');
//     //     }
//     //     console.log(result);
//     // })
    


//     // db.collection('tasks').insertMany([
//     //     {description:'microsoft teams', completed: true},
//     //     {description: 'vs code', completed: false},
//     //     {description: 'chrome', completed: true}
//     // ],
//     // (error, result)=>{
//     //     if(error){
//     //         return console.log('Uable to insert documents ');
//     //     }
//     //     console.log(result);
//     // })


// })

































// //................  Read data ..............................

// const {MongoClient, ObjectID} = require('mongodb');
// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

// MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client)=>{
//     if(error){
//         return console.log('Uable to connect to database');
//     }
//     const db = client.db(databaseName);

//     // findOne returns first document which satisfies the condition object provided
//     db.collection('users').findOne({name:'Jen'}, (error, user)=>{
//         if(error){
//             return console.log('Uable to fetch');
//         }
        
//         console.log(user);
//     })    

//     //  even though _id shows a value 61e82248edd52d0180adf7be its not the 
//     // string id which is actually present.. its the binary id which uniquely defines 
//     // a document... if we give search criteria to findOne({_id: 61e82248edd52d0180adf7be}) 
//     // it won't find the document...  we need to pass _id: new ObjectID('61e82248edd52d0180adf7be')


//     // find don't take a callback function... it returns a cursor ie. 
//     // pointer to the data inside mongodb, not the total data ... because it assumes that we may do some other 
//     // operations on these data , like count, match, first few data etc... 
//     // to get data we need to call toArray() of the cursor returned by it...
//     db.collection('users').find({age:19}).toArray((error, users)=>{
//         if(error){
//             return console.log("couldn't fetch data");
//         }
//         console.log(users);
//     })
//     // we can apply bunch of methods on the cursor returned
//     db.collection('users').find({age:19}).count((error, users)=>{
//         if(error){
//             return console.log("couldn't fetch data");
//         }
//         console.log(users);
//     })

  


// })



















// //............... update ....................

// const {MongoClient, ObjectID} = require('mongodb');

// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

// MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client)=>{
//     if(error){
//         return console.log('Unable to connect to database');
//     }
//     const db = client.db(databaseName);
//     console.log('Connected successfully ');
//     // update method is depricated...  we should be using updataOne or updateMany

//     // if we don't pass callback function to the findOne function it returns a promise.. check in the documentation
//     const updatePromise = db.collection('users').updateOne({
//         _id: new ObjectID('61e82248edd52d0180adf7be')
//     },{
//         // here we don't directly mention name: 'rbs' etc.   set don't affect the properties not mentioned... but changes
//         // property value for which it is explicitly mentioned
//         $set:{
//             name: 'kanha'
//         },
//         $inc:{
//             age:-10
//         }
//     });

//     updatePromise.then((result)=>{
//         console.log(result);
//     }).catch((error)=>{
//         console.log(error);
//     });




//     // updateMany
//     db.collection('tasks').updateMany({completed:false},{
//         $set:{
//             completed: true
//         }
//     }).then(result => console.log(result))
//       .catch(error => console.log(error));


// })


















// //.........   deleting ....................................


// const {MongoClient, ObjectID} = require('mongodb');

// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

// MongoClient.connect(connectionURL, {useNewUrlParser: true},(error, client)=>{
//     if(error){
//         return console.log('Unable to connect to Database !');
//     }

//     const db = client.db(databaseName);
//     db.collection('tasks').deleteMany({
//         description:'chrome',
//         completed:true 
//     }).then(result =>{
//         console.log(result);
//     }).catch(error=>{
//         console.log(error);
//     })


//     db.collection('tasks').deleteOne({
//         description:'vs code'
//     }).then(result=>console.log(result))
//       .catch(error=>console.log(error));





// })











