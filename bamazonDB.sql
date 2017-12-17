DROP DATABASE IF EXISTS bamazondb;

CREATE DATABASE bamazondb;

USE bamazondb;

CREATE TABLE products(
id INTEGER(11) AUTO_INCREMENT NOT NULL,
item_id INTEGER(4) NOT NULL,
product_name VARCHAR(100),
department_name VARCHAR(100),
price DECIMAL(6, 2),
stock_quantity INTEGER (4),
PRIMARY KEY (id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES (1001, "sweater", "clothing", 25.00, 10), 
(2200, "television", "electronics", 759.99, 4), 
(3010, "tent", "outdoor sports", 249.99, 8), 
(4040, "comforter set", "bedding", 39.00, 4), 
(1801, "jeans", "clothing", 35.00, 5), 
(7481, "silver necklace", "jewelry", 87.50, 3), 
(2290, "lap top computer", "electronics", 859.99, 4), 
(8443, "16pc dish set", "houseware", 35.50, 2), 
(9805, "oil filter", "automotive", 15.99, 9), 
(5999, "sneakers", "shoes", 79.00, 8);

