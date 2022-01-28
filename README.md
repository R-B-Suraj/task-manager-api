# task-manager-api
allows each user to manage their tasks securely

supported routes

/users          to signup with name,email,age,password fields <br />
/users/login    to login using email,password fields  <br />
/users/logout   to logout  <br />
/users/logoutAll   to logout from all the logged in devices <br />
/tasks          to create a task  with description,completed ?boolean   fields <br />
/users/me/avatar to upload profile pic <br />
/users/me        to read profile <br />
/users/:id       to get user data using user id <br />
/tasks?sortBy=createdAt_<desc or asc>&completed=false      to get tasks with filter <br />
/users/me    update <br />
/tasks/:id   to update task with task id.. <br />
/users/me/avatar   delete avatar <br />
/tasks/:id   delete a particular task <br />
/users/me    delete user <br />


use postman 

<br />
heroku <br />
https://task-managing-helper.herokuapp.com
