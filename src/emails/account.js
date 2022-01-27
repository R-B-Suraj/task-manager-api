
const nodemailer = require('nodemailer');
require('dotenv').config()


let transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_PASS
    },
    tls:{
        rejectUnauthorized: false,
    }
})



const sendWelcomeEmail = (email,name)=>{
    let mailOptions= {
        from: process.env.MY_EMAIL,
        to: email,
        subject: "Hello from VR world !",
        text:`Hi, ${name}. Your friend has invited to join our premium course.`
    }
    
    transporter.sendMail(mailOptions, function(err,success){
        if(err)
         console.log(err);
        else 
         console.log('Email sent successfully');
    })
    
}


const sendDeleteEmail = (email,name)=>{
    let mailOptions= {
        from: process.env.MY_EMAIL,
        to: email,
        subject: "Hello from VR world !",
        text:`Hi, ${name}. We long you to be with us. 
        Please give us some feedback on our service.
        we'll try to work on any inconvinience faced during our service.`
    }
    
    transporter.sendMail(mailOptions, function(err,success){
        if(err)
         console.log(err);
        else 
         console.log('Email sent successfully');
    })
    
}



module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
}