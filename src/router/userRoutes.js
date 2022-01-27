const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/middleware');
const multer = require('multer');       // supporting file upload with node js
const sharp = require('sharp');         // used for resizing images and apply common image format

const {sendWelcomeEmail,sendDeleteEmail}  = require('../emails/account');

// if adding more routes makes this file clumsy , we need to store route functions (req,res)  in separate controller file 
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const result = await user.save();
        // this is asynchronous , but we don't need to wait for this to complete
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();

        res.status(201).send({result,token});
    } catch (e) {
        res.status(400).send(e);
    }



});

// for user login we made a custom model function for user model 
// which can only be done if we make the model after making a separate schema 
// because custom model functions can only be declared using Schema 
router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        // res.send({user: user.getPublicProfile(),token}); // we can automate this step
        res.send({user,token});

    }catch(error){
        res.status(400).send('Error : incorrect login information');
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    try{
        // if this funciton is running that means user is authenticated inside auth.. so req.user contains the user
        req.user.tokens = req.user.tokens.filter((obj)=>{
            return obj.token !== req.token ;
        })
        await req.user.save();
        res.send(req.user.tokens);

    }catch(error){
        res.status(500).send();
    }
})


router.post('/users/logoutAll', auth,async (req,res)=>{
    try{
        req.user.tokens = [] ;
        await req.user.save();
        res.send(req.user.tokens);
    }catch(error){
        res.status(400).send();
    }
})

// // to run middleware for specific routes ... we can pass it as second argument 
// // while keep response function as third... if any route hits this 
// // first the middleware(second argument will run then third only if the second argument(middleware) calls next())
// router.get('/users', auth,async (req, res) => {
    
//    try{
//        const users = await User.find({});
//        res.send(users);
//    }catch(error){
//        res.status(500).send(error);
//    }
// })




router.get('/users/me', auth, async (req,res)=>{
    // this function(req,res) is only going to run if auth validates it..
    // and the user is stored in req.user . so we just have to send it...
    // no one is allowed to access user information of other users.. so we just kept 
    // this route users/me  to get data of user who is authenticated
    res.send(req.user);
    
})


const upload = multer({
    // dest:'user_profiles',
    limits: 2000000, // 3mb
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/) )
         return cb(new Error('upload format should be jpg, png or jpeg only, and size < 2MB'));
        
        cb(undefined, true);
    }
})

// router.post('/users/me/avatar', upload.single('profile'),(req,res)=>{
//     res.send();
// })

router.post('/users/me/avatar',auth , upload.single('profile'),async (req,res)=>{
    // we don't have access to the image uploaded here. because upload.single() runs first and  saves it in 
    // user_profiles folder... to access we need to remove destination property.
    // now multer provides the image data which can be used inside this function
    // req.file has all the properties that the file object in fileFilter has 
    // and it stores all the binary data that was inside the uploaded file 
   
   // req.user.avatar =  req.file.buffer;

    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    
    res.send();
}, (error, req, res, next)=>{
    res.status(404).send({error : error.message})
})


router.get('/users/:id/avatar', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error()
        }
// by default express sets Content-Type of the response to be application/json
// now browser knows response format is a jpg image.. so it directly shows the image
// if we send request from browser
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }catch(e){
        res.status(404).send();
    }
})










// we don't want to get user by id... no one except use should get profile data 
// and for that we already have a route 
// router.get('/users/:id', async (req, res) => {
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




// router.patch('/users/:id',auth, async (req, res)=>{
    // we want only the logged in user to modify their data 
router.patch('/users/me',auth, async (req, res)=>{

    const updates = Object.keys(req.body);

    const allowedUpdates = ['name','email','password','age']
    const isValid = updates.every(update=> allowedUpdates.includes(update));
  
    if(!isValid)
     return res.status(400).send('error: invalid update parameter');

    try{
        // const user = await User.findById(req.params.id);
        const user = req.user;
        updates.forEach(update=> user[update] = req.body[update]);
        await user.save(); // object saved with same id overwrites property values 
        // const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidators:true});
        // some mongoose functions like this.. findByIdAndUpdate() bypasses the middleware... like we had to set runValidators:true , 
        // so if someone updates the password the middleware that we placed
        // in user model won't work...  but it works with save()
        if(!user)
         return res.status(404).send();
         
        res.send(user);
    }catch(error){
        res.status(400).send(error);
    }
})


// we don't want the user or someone else to remove a user using its id 
// voluntarily or maliciously
// router.delete('/users/:id', auth, async (req, res)=>{
//     try{
//         const user = await User.findByIdAndDelete(req.params.id);
//         if(!user)
//          res.status(404).send('error: no document found with the id');

//          res.send(user);
//     }catch(e){
//         res.status(500).send(e);
//     }
// })







// we need to delete the tasks that the user created if the user account is getting deleted
// else the data will remain in the database 

router.delete('/users/me', auth, async (req, res)=>{
    try{
        // // remember we attached the user to req in auth
        // const user = await User.findByIdAndDelete(req.user._id);
        // if(!user)
        //  res.status(404).send('error: no document found with the id');
        sendDeleteEmail(req.user.email,req.user.name);
        await req.user.remove();
// req.user is the user that we got from data base ..   remove() method in mongoose
        res.send(req.user);
    }catch(e){
        res.status(500).send(e);
    }
})

router.delete('/users/me/avatar', auth, async (req, res)=>{
    try{
        req.user.avatar = undefined;
        // now the avatar field is gone
        await req.user.save();
        res.send();
    }catch(error){
        res.status(404).send();
    }
})






module.exports = router;




