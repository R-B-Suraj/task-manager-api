# API for managing task [[Task Manager heroku](https://task-managing-helper.herokuapp.com)]
`Node.js` `mongoDB`

This is an API which allows fascility to manage task for a user.
only an authenticated(authentication done using JWT) user can access his task.
user may get email notification on signing up or deleting user account.

## Features
- user signup, login, logout
- user logout from all logged in devices
- create a task
- store profile picture
- read profile
- read user
- read all tasks for a particular user
- read task using its id
- get profile picture
- update user
- update task
- delete user account
- delete task 
- delete profile picture


## Install

    npm install

## Run the app

    npm start
    
## Test the app

    npm test
    or requests can be sent using postman

# API references

The API to this app is described below.
All the attributes of req body should be given and with same name (case sensitive), along with the format specified below.

## Create User

### Request

`POST /users`

    https://task-managing-helper.herokuapp.com/users
    
    request body should contain following json object
    {
    "name": "USER ONE",
    "email": "oneuser@iitbbs.ac.in",
    "age": 20,
    "password": "oneuser@iitbbs.ac.in"
  }

### Response

    {
    "index": 0,
    "code": 11000,
    "keyPattern": {
        "email": 1
    },
    "keyValue": {
        "email": "oneuser@iitbbs.ac.in"
    }
  }

## User login

providing incorrect email id and password results in error<br/>
Error : incorrect login information
<br/>

### Request

`POST /users/login`

    https://task-managing-helper.herokuapp.com/users/login
    
    request body should contain following json object
    {
    "email":"oneuser@iitbbs.ac.in",
    "password":"oneuser@iitbbs.ac.in"
    }

### Response

{ <br/>
    "user": { <br/>
        "_id": "622eb38bea829fa613410700", <br/>
        "name": "USER ONE", <br/>
        "email": "oneuser@iitbbs.ac.in", <br/>
        "age": 20, <br/>
        "createdAt": "2022-03-14T03:16:27.256Z", <br/>
        "updatedAt": "2022-03-14T03:25:18.216Z",  <br/>
    }, <br/>
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjJlYjM4YmVhODI5ZmE2MTM0MTA3MDAiLCJpYXQiOjE2NDcyMjgzMTh9.9tQsx7QAYq9UGJ0m54HNzxQ9vVYljKDwgKNlXP3_7_0" <br/>
} <br/>


## User logout

### Request

`PUT /users/logout`

    https://task-managing-helper.herokuapp.com/users/logout
    

### Response

    returnes the id of user and deleted token, now requests to user specific api won't work  <br/>
   [ <br/>
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjJlYjM4YmVhODI5ZmE2MTM0MTA3MDAiLCJpYXQiOjE2NDcyMjc3ODl9.TjeMxz8BS9tNGWgJZrNWxzYV6HBXYRadA4J80c0bWy0",
        "_id": "622eb38dea829fa613410704"
    } <br/>
  ]
    
    
## logout from all logged in devices

### Request

`POST /users/logoutAll`

    https://task-managing-helper.herokuapp.com/users/logoutAll
    
### Response

 []
 
## create task for user

### Request

`POST /tasks`

    https://task-managing-helper.herokuapp.com/tasks
    
    request body should contain following attributes
    {
    "description": "task 1 ",
    "completed": true
    }
    
### Response

 {
    "description": "task 1",
    "completed": true,
    "owner": "622eb38bea829fa613410700",
    "_id": "622eb82dea829fa613410724",
    "createdAt": "2022-03-14T03:36:13.738Z",
    "updatedAt": "2022-03-14T03:36:13.738Z",

}
 

## Create avatar

### Request

`POST /users`

    https://task-managing-helper.herokuapp.com/users/me/avatar
    
    request body should contain form-data with key= profile  value = profile-pic.jpg <br/>
    keep image size less than 2 mb

## Read profile

### Request

` GET /users/me`

    https://task-managing-helper.herokuapp.com/users/me
    
### Response

  {
    "_id": "622eb38bea829fa613410700",
    "name": "USER ONE",
    "email": "oneuser@iitbbs.ac.in",
    "age": 20,
    "createdAt": "2022-03-14T03:16:27.256Z",
    "updatedAt": "2022-03-14T03:43:46.061Z",
    
}

## Get user tasks

### Request

` GET /tasks?sortBy=createdAt_desc`

    https://task-managing-helper.herokuapp.com/tasks?sortBy=createdAt_desc
    
### Response

  [
    {
        "_id": "622ebc72ea829fa613410742",
        "description": "task 3",
        "completed": true,
        "owner": "622eb38bea829fa613410700",
        "createdAt": "2022-03-14T03:54:26.434Z",
        "updatedAt": "2022-03-14T03:54:26.434Z",
         
    },
    {
        "_id": "622ebc6eea829fa61341073d",
        "description": "task 2",
        "completed": true,
        "owner": "622eb38bea829fa613410700",
        "createdAt": "2022-03-14T03:54:22.067Z",
        "updatedAt": "2022-03-14T03:54:22.067Z",
       
    },
    {
        "_id": "622eb82dea829fa613410724",
        "description": "task 1",
        "completed": true,
        "owner": "622eb38bea829fa613410700",
        "createdAt": "2022-03-14T03:36:13.738Z",
        "updatedAt": "2022-03-14T03:36:13.738Z",
      
    }
]


## Read task of a user

### Request

` GET /tasks/:id`
  inplace of :id  task id should be placed

    https://task-managing-helper.herokuapp.com/tasks/622ebc6eea829fa61341073d
    
### Response

  {
    "_id": "622ebc6eea829fa61341073d",
    "description": "task 2",
    "completed": true,
    "owner": "622eb38bea829fa613410700",
    "createdAt": "2022-03-14T03:54:22.067Z",
    "updatedAt": "2022-03-14T03:54:22.067Z",
 
}


## get profile pic

### Request

` GET /users/:id/avatar`
 call this api from browser. in place of :id user id should be placed

    https://task-managing-helper.herokuapp.com/users/622eb38bea829fa613410700/avatar
    
### Response
  profile image is returned
  
 
## Update user data

### Request

` PATCH /users/me `
  req body should contain attributes to update as shown
  
    https://task-managing-helper.herokuapp.com/users/me
  
  {
    "age": 20,
    "password": "suraj1"
  } 

### Response

{
    "_id": "622eb38bea829fa613410700",
    "name": "USER ONE",
    "email": "oneuser@iitbbs.ac.in",
    "age": 20,
    "createdAt": "2022-03-14T03:16:27.256Z",
    "updatedAt": "2022-03-14T04:02:37.280Z",

}

## Update task data for a user

### Request

` PATCH /tasks/:id `
  in place of :id  task id should be placed. <br/>
  reqest body should contain following attributes 
  
    https://task-managing-helper.herokuapp.com/tasks/61ed6d4e862f3dceb431a9d4
  
  {
    "completed": false
  }

## Delete user account

### Request

` DELETE /users/me`

    https://task-managing-helper.herokuapp.com/users/me
    

## Delete task of a user

### Request

` DELETE /tasks/:id`

    https://task-managing-helper.herokuapp.com/tasks/61ed6d4e862f3dceb431a9d4
    
## Delete profile picture of user

### Request

` DELETE /users/me/avatar`

    https://task-managing-helper.herokuapp.com/users/me/avatar

