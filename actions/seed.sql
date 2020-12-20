DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role_info (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NULL,
    salary DECIMAL(10,2) NULL,
    department_id INT(10) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    role_id INT(10) NULL,
    manager_id INT(10) NULL,
    PRIMARY KEY (id)
);

INSERT INTO department (dept_name) VALUES("Human Resources"),("Accounting"),("IT");
INSERT INTO role_info (title, salary, department_id) VALUES ("Director of HR", 80000.00, 11);
SELECT * FROM department;
SELECT * FROM role_info;

