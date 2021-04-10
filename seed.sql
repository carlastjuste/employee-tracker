INSERT INTO department (name)
VALUES ("Marketing"),
("Information Technology"),
("Compliance"), 
("Sales"), 
;

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer",150000.00,1),
("QA Analyst",60000.00,1),
("Marketting Analyst",200000.00,2),
("Compliance Associate",100000.00,2),
("Director of sales",115000.00,3),
("Sales Associate",50000.00,3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Carlo","Luis",1,null),
("Kloe","Samir",2,1),
("Victor", "Ray",3,null),
("Mitch","Geroges",4,3),
("Aria","Stark",5,null),
("John","Snow",6,5);