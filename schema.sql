--Creating the Bamazon DB and products table:

DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT(11) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) DEFAULT NULL,
  price DECIMAL(10,2) DEFAULT NULL,
  stock_quantity INT(100) DEFAULT NULL,
  PRIMARY KEY (id)
);


--Creating Supervisor table:

USE bamazon;

CREATE TABLE departments (
  department_id INT(11) NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) DEFAULT NULL,
  over_head_costs DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (id)
);
-- Fin --