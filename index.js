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
      name: "module",
      type: "list",
      message: "What feature would you like to use?",
      choices: ["View All Employees" , "Add Employee", "Update Employee Role"
                ,"View All Roles", "Add Role" 
                , "View All Departments", "Add department"
                ,"Quit"
                ]
    }
  ];


  inquirer.prompt(prompts)
    .then(answer => {
      switch (answer.module) {
        case "View All Employees":
          ViewAllEmployees();
          break;
       case "Add Employee":
          AddEmployee();
          break;
       case "Update Employee Role":
          SearchEmployeeById("UpdateRole");
          break;
      case "View All Roles":
          ViewAllRoles();
          break;
      case "Add Role":
          AddRole();
          break;
      case "View All Departments":
          ViewAllDepartments();
          break;
      case "Add Department":
           AddDepartment();
           break;
      case "Delete Department":
          SearchDepartmentById("Delete");
            break;
      case "Quit":
          console.log("Exiting!")
          connection.end();
          break;
        default:
          console.log('No option was selected exiting');
          connection.end();
    }
  });
