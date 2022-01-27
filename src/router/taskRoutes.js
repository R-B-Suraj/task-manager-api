const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/middleware');

// if adding more routes makes this file clumsy , we need to store route functions (req,res)  in separate controller file 


router.post('/tasks', auth,async (req, res) => {
    // const task = new Task(req.body);
    // we are not taking user id from the user as input... we want to keep
    // the task associated with the user who created it...  in auth we authenticated the user
    // we can use the id if the authenticated user. with each request we have the 
    // token containing user id as the payload...
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        const result = await task.save();
        res.status(201).send(result);
    }catch{e => res.status(400).send(e)};
  
})



// this will return all tasks , even which are not created by the recently
// logged in user 
// router.get('/tasks',async (req, res) => {
//     try{
//         const tasks = await Task.find({});
//         res.send(tasks);
//     }catch{e => res.status(400).send(e)};

// })

// two ways  to solve the above problem.. either provide filter for owner
// inside find or pupulate tasks for the authenticated user 




// get  /tasks?completed=true
// get  /tasks?limit=5&skip=10
// get /tasks?sortBy=createdAt_asc  fieldname_order then we'll split the string
router.get('/tasks',auth,async (req, res) => {
 
    const matchParams = {}
    const sort = {}

    if(req.query.completed){
        // all query parameters are string , not boolean or number
        matchParams.completed = (req.query.completed === 'true');
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1]==='desc' ? -1: 1 ;
        // we are using the [] for key value pair because we don't have property parts[0] in sort
    }

    try{
        // const tasks = await Task.find({owner: req.user._id});
       // await req.user.populate('myTasks'); 
       // it doesn't return the populated tasks... 
        // it just populate the user data 
       // this will populate every task of user
       // which we don't want we want specific tasks to be populated
        await req.user.populate({
            path: 'myTasks',
            // path shows what to populate with, here myTasks is a virtual field in user
            // match is used to set conditions, based on which data is populated
            match: matchParams,
// options provide feq parameters  like limit, skip, helps in sorting , pagination
// limit sets the number of data received from database (which is to be sent to user)
// skip:x tells to skip first  x number of data and then send data            
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: sort
                    // createdAt: -1
            
                
            }
            
        })
        res.send(req.user.myTasks);

    }catch{e => res.status(400).send(e)};

})


 


router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id;
     
    try{
        
       // const task = await Task.findById(_id);
       // we want the task to be found by id .. before that we need to make sure that 
       // the owner has the same id as that of the authenticated user...
       const task = await Task.findOne({_id,owner: req.user._id});
        
        if(!task)
         return res.status(404).send();
        res.send(task);
    }catch{e => res.status(400).send(e)}
    
})









router.patch('/tasks/:id', auth, async (req, res)=>{

    const allowedUpdates = ['description','completed'];
    const updates = Object.keys(req.body);
    const isValid = updates.every(update=> allowedUpdates.includes(update));

    if(!isValid)
     return res.status(400).send('error: invalid update parameter');

    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        // const task = await Task.findById(req.params.id, req.body,{new:true, runValidator:true});
        
        
        if(!task)
         return res.status(404).send();
        
         updates.forEach(update=> task[update] = req.body[update]);
         await task.save();

        res.send(task);

    }catch(e){
        res.status(400).send(e)
    };
})







router.delete('/tasks/:id',auth, async (req,res)=>{
    try{

    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});

    if(!task)
     return res.status(400).send()

    res.send(task);

    }catch(e){
        res.status(400).send(e);
    }

})


module.exports = router;
