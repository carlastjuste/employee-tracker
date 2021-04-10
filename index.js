const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
var util = require("util");


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

  // using built-in utils method to have connection.query() return a promise
connection.query = util.promisify(connection.query);

  //Prompt
  const track = async () => {
      const prompts = [
      
        {
          name: "module",
          type: "list",
          message: "What feature would you like to use?",
          choices: ["View All Employees" , "View All Departments","View All Roles"
                    ,"Add Employee", "Add Role", "Add department"
                    ,"Update Employee Role"
                    ,"Quit"
                    ]
        }
      ];

    const choice = await inquirer.prompt(prompts);
    const action = choice.module;

    switch (action) {
      case "View All Employees":
          ViewAllEmployees();
          break;
      case "View All Departments":
          ViewAllDepartments();
          break;
      case "View All Roles":
            ViewAllRoles();
            break;
      case "Add Employee":
          AddEmployee();
          break;
      case "Add Department":
          AddDepartment();
          break;
      case "Add Role":
        AddRole();
        break;
      case "Update Employee Role":
            SearchEmployeeById("UpdateRole");
            break;
      case "Quit":
          console.log("Exiting!")
          connection.end();
          break;
        default:
          console.log('No option was selected exiting');
          connection.end();
    }
  };

  //----------------List of functions ---------------------//
  //------------------------------------------------------//

//Function to view list of employees
let ViewAllEmployees = async () => {
  let query = "SELECT emp.id , emp.first_name , emp.last_name , title , NAME as department , salary , CONCAT(m.first_name ,' ', m.last_name) as manager";
      query += " FROM employee emp LEFT JOIN  ROLE r ON emp.role_id = r.id";
      query += " LEFT JOIN  department d ON d.id = r.department_id";
      query += " LEFT JOIN employee m  ON m.id = emp.manager_id";

  let employees = await connection.query(query);
      var arr = [];
      for (var i = 0; i < employees.length; i++) {
          arr.push([employees[i].id, employees[i].first_name, employees[i].last_name, employees[i].title, employees[i].department, employees[i].salary , employees[i].manager]);
      }
      console.table(['Id', 'First Name', 'Last Name', 'Title', 'Department', 'Salary',  'Manager'], arr);
      track();

}

// Function to view list of departments
let ViewAllDepartments = async () => {
  const query = "SELECT id, name FROM department limit 500";

  let departments = await connection.query(query);
  let arr = [];
      for (var i = 0; i < departments.length; i++) {
          arr.push([departments[i].id, departments[i].name]);
      }
      console.table(['id', 'name'], arr);
      track();
}

//Function to view list of roles
let ViewAllRoles = async () => {
  let query = "SELECT r.id, title, salary, NAME AS department";
      query += " FROM ROLE r INNER JOIN department d ON d.id = r.department_id";
  
  let roles = await connection.query(query);
      var arr = [];
      for (var i = 0; i < roles.length; i++) {
          arr.push([roles[i].id, roles[i].title, roles[i].salary, roles[i].department]);
      }
      console.table(['id', 'title', 'salary', 'department'], arr);
      track();
}





track();