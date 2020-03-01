USE employeeTrackerDB;

INSERT INTO department (name)
VALUES ("Accounting"), ("Human Resources"), ("Marketing"), ("Development");

INSERT INTO role (title, salary, department_id) VALUES('Accountant', 65000, 1);
INSERT INTO role (title, salary, department_id) VALUES('Secretary', 45000, 2);
INSERT INTO role (title, salary, department_id) VALUES('Marketer', 55000, 3);
INSERT INTO role (title, salary, department_id) VALUES('Developer', 70000, 4);
INSERT INTO role (title, salary, department_id) VALUES('Accounting Manager', 90000, 1);
INSERT INTO role (title, salary, department_id) VALUES('Development Manager', 90000, 4);
INSERT INTO role (title, salary, department_id) VALUES('Marketing Manager', 90000, 3);

INSERT INTO employee(first_name, last_name, role_id) VALUES('Eli', 'Smol', 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('Matt', 'Green', 3, 8);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('Sam', 'Smith', 4, 7);
INSERT INTO employee(first_name, last_name, role_id) VALUES('Elle', 'Woods', 2);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('Michael', 'Scott', 1, 6);
INSERT INTO employee(first_name, last_name, role_id) VALUES('Sara', 'Patel', 7);
INSERT INTO employee(first_name, last_name, role_id) VALUES('Mitch', 'Conors', 6);
INSERT INTO employee(first_name, last_name, role_id) VALUES('Cynthia', 'Scott', 5);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('Frank', 'Sanders', 4, 7);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('Tammy', 'Waters', 1, 6);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('Matthew', 'Franklin', 3, 8);