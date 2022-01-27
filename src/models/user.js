// const mongoose = require('mongoose');

// const validator = require('validator');


// const User = mongoose.model('User',{
//     // the object that we passed here is converted to a schema in mongoose
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email:{
//         type: String, 
//         trim: true,
//         lowerCase: true,
//         required: true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('email is invalid');
//             }
//         }
//     },
//     age:{
//         type: Number,
//         default: 0,

//         validate(value){
//             if(value < 0){
//                 throw new Error('Age must be a positive number');
//             }
//         }

//     },
//     password:{
//         type: String,
//         required: true,
//         minLength: 6,
//         trim: true,
//         validate(value){
//             if(value.includes('password')){
//                 throw new Error("password shouldn't contain  'password' ");
//             }
//         }
//     }
// })


// module.exports = User;












// ...............hash password................

const mongoose = require('mongoose');
const bcrypt =  require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Task = require('./task');
require('dotenv').config();


const userSchema = new mongoose.Schema({
  
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String, 
        unique:true, 
        // this means email is unique..  
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

        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number');
            }
        }

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
    },
    // we keep all tokens generated for a user in an array...  so that a user can 
    // log in from multiple devices and log out from one and still be logged in , in another device 

    tokens: [{
        token:{
            type: String,
            required: true 
        }
    }],
// user profile image data are stored in user only , because in most deployment platform 
// file system data is wiped out.. so we'll loose data.
    avatar:{
        type: Buffer,
        // buffer allows to store binary data of image along side of user who created it 
    }
    
} , {
    // while building schema this is the second option which is also an object.. timestamps which is false by
    // default, this creates additional fields which show when this is created, updated
    timestamps: true

});



// see the user's tasks  section in index.js.... 
// virtual is used for making virtual attributes...
// first is name for virtual field
// virtual properties just shows the relations between themodels.. and don't 
// actually store the data in the database...
// it need a reference..  here myTasks refers to Task model 
// foreighField is the field on the Task which will make a relation with 
// the user's id, which is stored in  _id field (localfield ) of the User 



userSchema.virtual('myTasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// now we can populate the tasks that the user created 




// generate webtoken 
// userSchema.methods.function  are functions which can be applied to only
// a particular user.. ie. these are instance methods 

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    // express payload to be string
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_STRING);
    
    user.tokens = user.tokens.concat({token});
    await user.save();
    // generate token and save it to users 
    return token;
    
};

// methods is used for instance functions, statics is used for model functions
// we don't want even the user to be exposed to the password and all tokens , why do he even need that 
// userSchema.methods.getPublicProfile = function () {
// instead of getPublicProfile  keep the name of the instance function toJSON  (same as it is typed)
// this will automatically run and we don't have to mention res.send({user:user.getPublicProfile, token})..
// in /users/login  route... see toJSON code section of index.js scroll down

userSchema.methods.toJSON = function () {    
    const user = this;
    const userObject = user.toObject();
    // convert the mongoose user data to useful user object, we don't need extra data which mongoose stores 

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
// we don't want password and tokens , avatar (large size)to be there in the user object that we send 
    return userObject;
};



// use login 

// basic thing in login system...
// if someone has two accounts can't be registered with same email..
// so we made email , unique
// we can access functions using the model later, if we declare here as 
// userSchema.statics.function  
// these static functions are available to model
userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({email});

    if(!user)
     throw new Error('unable to login');
    
     const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch)
     throw new Error('unable to login')
     // its better if we don't send feedback that password is wrong..
     // because if someone trying to hack account.. may become sure that atleast the email is correct.
     return user;   
}




// hash the plain text password before saving 

// pre and post middleware is used to do something before/after some event has occured 
// the function it takes should be normal function and not an arrow function , because as we know 
// arrow function don't have this binding 

userSchema.pre('save', async function (next){
    
    const user = this;
    console.log('just before saving');

    if(user.isModified('password')){
        // this checks whether user's  password  field is modified or not 
        // this is true while creating and updating also 
        user.password = await bcrypt.hash(user.password, 8);
    }


    next();
    // this is to tell mongoose that we are done applying the middleware .. 
    // else mongoose will think we are still running some code before saving and hang
})





// while deleting user we can put the delete code for tasks there itself..
// but to use another middle ware is better.. if we are allowed to delete user from somewhere else in the application and
// and not only from the route /users/me

// delete user tasks when user is removed 

userSchema.pre('remove', async function (next){
    const user = this;

    await Task.deleteMany({owner: user._id});

    next();
})







// if we don't use useSchema  and instead pass the user object directly to the model 
// we wouldn't be able to apply the middlewares / custom functions that we apply to the schema

const User = mongoose.model('User',userSchema);


module.exports = User;