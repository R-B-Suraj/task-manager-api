# task-manager-api
allows each user to manage their tasks securely

supported routes

/users          to signup with name,email,age,password fields
/users/login    to login using email,password fields 
/users/logout   to logout 
/users/logoutAll   to logout from all the logged in devices
/tasks          to create a task  with description,completed ?boolean   fields
/users/me/avatar to upload profile pic 
/users/me        to read profile
/users/:id       to get user data using user id 
/tasks?sortBy=createdAt_<desc or asc>&completed=false      to get tasks with filter
/users/me    update
/tasks/:id   to update task with task id..
/users/me/avatar   delete avatar 
/tasks/:id   delete a particular task
/users/me    delete user 


use postman 
