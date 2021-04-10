const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');


console.log("---------------EMPLOYEE TRACKER APP---------------");
console.log("Please use this application to view and manage the departments, roles, and employees");

//connection to MySQL
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_tracker"
  });
  

  connection.connect(err => {
      if (err) throw err;
    console.log("Connected to employee_tracker on MySQL !");
  });


  const prompts = [
    {
        type:'input',
        name:'name',
        message:'What\'s the team member\'s name?'
       
    },
    {
        type: 'input',
        name:'id',
        message: 'What\'s the team member\'s id?'
    },
    {
        type: 'input',
        name:'email',
        message: 'What\'s the team member\'s email address?'
    },
    {
        type: 'list',
        name: 'role',
        message: 'What\'s the team member\'s role?',
        choices: ['Manager', 'Engineer', 'Intern']
    }
  ];

