const mongoose = require('mongoose');
// require('dotenv').config()
// we can config() here or we must config before using this module
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true 
    // if we get any deprecation error while runnign a program using mongoose
    // we can address that here by mentioning whether to use the function used behind or not 
    // like useNewUrlParser: true  , useFindAndModify:false etc...
    
});
