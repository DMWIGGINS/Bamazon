// npm packages needed to run app
var mysql = require("mysql");
var inquirer = require("inquirer");

// create connection to mysql to store, get and manipulate information
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazonDB"
});

// show id of successful connection or if error connecting throw error 
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
})

function managerMenu() {
    inquirer
        .prompt([{
            type: "list",
            message: "Please choose an option from the list.",
            name: "managerchoice",
            choices: ["View Products", "Low Inventory", "Add Inventory", "Add New Product"]
        }])
        .then(function (answer) {
            if (answer.managerchoice === "View Products") {
                viewProducts();
            } else if (answer.managerchoice === "Low Inventory") {
                lowInventory();
            } else if (answer.managerchoice === "Add Inventory") {
                addInventory();
            } else if (answer.managerchoice === "Add New Product") {
                addNewProduct();
            };
        });
};

function viewProducts() {

    connection.query("SELECT * FROM products", function (err, res) {

        for (var i = 0; i < res.length; i++) {

            console.log("Product Name: " + res[i].product_name);
            console.log("Item Number: " + res[i].item_id);
            console.log("Department: " + res[i].department_name);
            console.log("Quantity in Stock: " + res[i].stock_quantity);
            console.log("Price: $" + (res[i].price).toFixed(2));
            console.log("-----------------------------------");
        }
    });
};

function lowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {

        console.log("These items have less than five in available inventory");
        console.log("------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log("Product Name: " + res[i].product_name);
                console.log("Item Number: " + res[i].item_id);
                console.log("Quantity in Stock: " + res[i].stock_quantity);
                console.log("----------------------------------------------");
            }
        };
    });
};



function addInventory() {
    inquirer
        .prompt([{
                type: "input",
                message: "Please enter name of product to add inventory.",
                name: "productname"
            },
            {
                type: "input",
                message: "How many would you like to add?",
                name: "addinventory"
            }
        ])
        .then(function (answer) {
                connection.query("SELECT * FROM products", function (err, res) {






                            // function addNewProduct()
                            // List a set of menu options:
                            // View Products for Sale
                            // View Low Inventory
                            // Add to Inventory
                            // Add New Product
                            // If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
                            // If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
                            // If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
                            // If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
                            // setTimeout(managerMenu, 500);