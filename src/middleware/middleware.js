const jwt = require('jsonwebtoken');
const User = require('../models/user');



const auth = async (req,res,next)=>{
    
   try{
        const token = req.header('Authorization').replace('Bearer ','');
        console.log(token);
        // this replace will cause error if token is empty.. which is also handled in catch
        const decoded = jwt.verify(token,'thisismyuserid'); 
        // token is again hashed with the secret string to get the payload object back
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
        // we put id on payload... and using 'tokens.token':token means cheching whether the token is present
        // in the tokens array of the user...  if we are using special characters in the query object for find()
        // it should be a string ...
        
        if(!user){
            throw new Error();
        }
        
        req.token = token;
        // if we logout from one device we shouldn't be logged out from another device..
        // so we need to remove the only token corresponding to which we logged in from our device 
        req.user = user;
        // we already found the user.. there is not point in finding it again in the router handler function( 3rd argument)
        // we can now access the user found.. from req object inside the router handler function  (req,res)
        next();
        // middleware work is done.. move next()
   }catch(e){
       res.status(401).send('error: please authenticate');
   }
   

}

// client has to send the authentication token...
// with request header it can send Authorization= Bearer token_value  key=value pair 
// bearer .. client is sending token for authorization


module.exports = auth;