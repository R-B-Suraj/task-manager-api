// const mongoose = require('mongoose');



// const Task = mongoose.model('Task',{
//     description: {
//         type: String ,
//         required: true,
//         trim: true
//     },
//     completed:{
//         type: Boolean,
//         default: false
//     },
//     // we are storing the user id, which created the task... 
//     // we need owner for the task.. no longer it will be creating task annonymously 

//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true ,
//         ref: 'User'
//         // see the  ower fo the task section of index.js 
//         // ref  is a reference to the User model that we created.. linking user profile to task 
//     }

// });


// module.exports = Task;
















// ..................................................

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

    }
    , {
        timestamps: true
        // we can set this time stamp only if we are creating the schema independently
        // and not passing in the model as an object... 
    });


const Task = mongoose.model('Task', taskSchema);


module.exports = Task;