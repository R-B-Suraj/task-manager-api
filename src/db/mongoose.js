

const validator = require('validator');
const mongoose = require('mongoose');
// mongoose uses the mongodb package behind..
// similar to MongoClient and others 
// here we specify the database name in the url string 

const url = 'mongodb://127.0.0.1:27017/task-manager-api';

mongoose.connect(url,{
    useNewUrlParser: true,
    // useCreateIndex: true   
    // this ensures that mongoose create indices for the documents while
    // dealing with these..  so that accessing data and deleanig with
    // them here will be easy 
})
  

// a model is used for a set of documents... model name , model schema
const User = mongoose.model('User',{
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String, 
        trim: true,
        lowerCase: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid');
            }
        }
    },
    age:{
        type: Number,
        default: 0,
// mongoose provides few built in validations like min, max .. but those are not enough...
// custom validation is done  using the  
// validate(value) function.. value is the value of the property provided which is available to validate function 
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number');
            }
        }
        // now if we provide age -ve  it will through error 
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        trim: true,
        validate(value){
            if(value.includes('password')){
                throw new Error("password shouldn't contain  'password' ");
            }
        }
    }
})

// me is the user model 
const me = new User({
    name: '   kanha ',
    email:'SuRaj@mail.com  ',
    // age: 15
    
    password: '  345263pass'
})


// save ...  we ge access to the data from database which we just saved 
me.save()
    .then(result=>console.log(result))
    .catch(error => console.log(error));


































// //........ challenge ............
// const mongoose = require('mongoose');

// const url = 'mongodb://127.0.0.1:27017/task-manager-api';

// mongoose.connect(url,{useNewUrlParser: true})
// .then(result => console.log('connected successfully'))
// .catch(error => console.log(error));


// const Task = mongoose.model('Task',{
//     description: {
//         type: String ,
//         
//         required: true,
//         trim: true
//     },
//     completed:{
//         type: Boolean,
//         default: false
//     },
    
// });



// const task1 = new Task({
//     description: 'shopping',
    
// });

// task1.save()
//     .then(result => console.log(result))
//     .catch(error => console.log(error));



