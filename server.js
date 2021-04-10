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
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to employee_tracker database!");
  });