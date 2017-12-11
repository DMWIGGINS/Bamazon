var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    queryAllProducts();
});


function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("Welcome to Bamazon!");
        console.log("Here is a list of items for sale.");
        console.log("----------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("Product Name: " + res[i].product_name);
            console.log("Item number: " + res[i].item_id);
            console.log("Price: $" + res[i].price);
            console.log("-----------------------------------");
        }
    });
}