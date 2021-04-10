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
                    ,"Add Employee", "Add Role", "Add Department"
                    ,"Update Employee Role"
                    ,"Quit"
                    ]
        }
      ];

    const choice = await inquirer.prompt(prompts);
    const action = choice.module;

    switch (action) {
      case "View All Employees":
          viewAllEmployees();
          break;
      case "View All Departments":
          viewAllDepartments();
          break;
      case "View All Roles":
          viewAllRoles();
          break;
      case "Add Employee":
          addEmployee();
          break;
      case "Add Department":
          addDepartment();
          break;
      case "Add Role":
          addRole();
          break;
      case "Update Employee Role":
          updateEmployeeRole();
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
let viewAllEmployees = async () => {
  try{
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
  }catch (err) {
    console.log(err);
    track();
}


}

// Function to view list of departments
let viewAllDepartments = async () => {
  try{
  const query = "SELECT id, name FROM department limit 500";

  let departments = await connection.query(query);
  let arr = [];
      for (var i = 0; i < departments.length; i++) {
          arr.push([departments[i].id, departments[i].name]);
      }
      console.table(['id', 'name'], arr);
      track();
    }catch (err) {
      console.log(err);
      track();
  }

}

//Function to view list of roles
let viewAllRoles = async () => {
  try{
  let query = "SELECT r.id, title, salary, NAME AS department";
      query += " FROM ROLE r INNER JOIN department d ON d.id = r.department_id";
  
  let roles = await connection.query(query);
      var arr = [];
      for (var i = 0; i < roles.length; i++) {
          arr.push([roles[i].id, roles[i].title, roles[i].salary, roles[i].department]);
      }
      console.table(['id', 'title', 'salary', 'department'], arr);
      track();
  }catch (err) {
    console.log(err);
    track();
}
}

//function to add employee
let addDepartment = async () => {
  try {
    let department = await inquirer.prompt([{
        name: "name",
        type: "input",
        message: "What is the name of the department you would like to add?"
      }
    ]);

    const query = "INSERT INTO department SET ?";
    var result = await connection.query(query, {name: department.name});

    console.log("New Department added successfully");
      viewAllDepartments();
        }catch (err) {
          console.log(err);
          track();
      }  
}


//function to add role
let addRole = async () => {
  try {
  var departmentList = await connection.query ("SELECT * FROM department");

  var answer = await inquirer.prompt([
        {
          name: "department",
          type: "rawlist",
          choices: () =>{
            var choiceArray = [];
            for (var i = 0; i < departmentList.length; i++) {
              choiceArray.push(departmentList[i].name);
            }
            return choiceArray;
          },
          message: "What is the department name for the role?",
        },
        {
          name: "title",
          type: "input",
          message: "What is the title of the role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for the role?"
        }
      ]);

      // get the id of the chosen department
      var departmentId;
      for (var i = 0; i < departmentList.length; i++) {
          if (departmentList[i].name === answer.department) {
            departmentId = departmentList[i].id;
          }
      }

    const query ="INSERT INTO role SET ?";
    let result = await connection.query(query,
      {
      title: answer.title,
      salary: answer.salary,
      department_id: departmentId
      });

    console.log("New role added successfully");
    viewAllRoles();
    } catch (err) {
      console.log(err);
      track();
  }
}

//Function to add empolyee
let addEmployee = async () => {
  try {
  var roleList = await connection.query ("SELECT * FROM role");

  var empQuery = "SELECT emp.id, CONCAT(emp.first_name, ', ',  emp.last_name) as empname, role_id";
      empQuery +=" FROM employee AS emp";
      empQuery += " INNER JOIN role AS r";
      empQuery +=" ON emp.role_id = r.id";
  
  var empList = await connection.query (empQuery);
  
  var answer = await inquirer.prompt([
    {
      name: "role",
      type: "rawlist",
      choices: () =>{
        var choiceArray = [];
        for (var i = 0; i < roleList.length; i++) {
          choiceArray.push(roleList[i].title);
        }
        return choiceArray;
      },
      message: "What\'s the employee \'s role?"
    },
    {
      name: "first_name",
      type: "input",
      message: "What\'s the employee\'s first name?"
    },
    {
      name: "last_name",
      type: "input",
      message: "What\'s the employee\'s last name?"
    },
    {
      name: "manager",
      type: "rawlist",
      choices: () =>{
        var choiceEmp = [];
        for (var i = 0; i < empList.length; i++) {
          choiceEmp.push(empList[i].empname);
        }
        choiceEmp.unshift('n/a');
        return choiceEmp;
      },
      message: "What\'s the employee\'s manager name?"
    }
  ]);

   // get the role Id
   var roleId;
   for (var i = 0; i < roleList.length; i++) {
       if (roleList[i].title === answer.role) {
            roleId = roleList[i].id;
       }
   }

  // get the manager Id
    var managerId = null;
    for (var i = 0; i < empList.length; i++) {
        if (empList[i].empname === answer.manager) {
          managerId = empList[i].id;
        }   
    }

    //
    const query ="INSERT INTO employee SET ?";
    let result = await connection.query(query,
      {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: roleId,
        manager_id: managerId 
      });
    
  console.log("New employee added successfully!");
  viewAllEmployees();

}catch (err) {
  console.log(err);
  track();
}
}

//function to update update employee role
let updateEmployeeRole = async() => {
  try{
    var roleList = await connection.query ("SELECT * FROM role");
    var answer = await inquirer.prompt([
      {
        name: "role",
        type: "rawlist",
        choices: () =>{
          var choiceArray = [];
          for (var i = 0; i < roleList.length; i++) {
            choiceArray.push(roleList[i].title);
          }
          return choiceArray;
        },
        message: "Select the role you would like to update:"
      },
      {
        type: 'list',
        name: 'column',
        message: 'Select the column to update:',
        choices: ['title', 'salary', 'department_id']
    }
    ])

       // get the role Id
   var roleId;
   for (var i = 0; i < roleList.length; i++) {
       if (roleList[i].title === answer.role) {
            roleId = roleList[i].id;
       }
   }

   var newValquest = [{
      name: "value",
      type: "input",
      message: "What\'s the new value?"
    }];

    switch (answer.column) {
      case "title":
        var newValue = await inquirer.prompt(newValquest);
        query = "UPDATE role SET "+ answer.column + "=" +"'" + newValue.value + "'" + " WHERE id=" +roleId;
        connection.query(query);
        //updateRole(roleId, answer.column, newValue.value);
        console.log("Update successful!");
        break;

      case "salary":
        var newValue = await inquirer.prompt(newValquest);
        query = "UPDATE role SET "+ answer.column + "=" + newValue.value + " WHERE id=" + roleId;
        connection.query(query);
        console.log("Update successful!");
        break;

      case "department_id":
        var departmentList = await connection.query ("SELECT * FROM department");
        var newDept = await inquirer.prompt([
            {
              name: "department",
              type: "rawlist",
              choices: () =>{
                var choicedept = [];
                for (var i = 0; i < departmentList.length; i++) {
                  choicedept.push(departmentList[i].name);
                }
                return choicedept;
              },
              message: "Select the new department for the role:"
            }
          ]);

        var departmentId;
        for (var i = 0; i < departmentList.length; i++) {
            if (departmentList[i].name === newDept.department) {
              departmentId = departmentList[i].id;
            }
        }

        query = "UPDATE role SET "+ answer.column + "=" +"'" + departmentId + "'" + " WHERE id=" +roleId;
        connection.query(query);
        console.log("Update successful!");
          break;

      case "Quit":
          console.log("Exiting!")
          connection.end();
          break;
        default:
          console.log('No option was selected exiting..');
          connection.end();
    }
    viewAllRoles();
  }catch (err) {
    console.log(err);
    track();
}
}

track();