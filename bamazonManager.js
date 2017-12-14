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
                var itemMatch = 1;

                console.log("Product Name: " + res[i].product_name);
                console.log("Item Number: " + res[i].item_id);
                console.log("Quantity in Stock: " + res[i].stock_quantity);
                console.log("----------------------------------------------");
            }
        };
        if (itemMatch != 1) {
            console.log("There are no products with less than 5 in stock.");
        };

    });

};

function addInventory() {
    connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw err;
        inquirer
            .prompt([{
                    type: "list",
                    message: "Please select product to add inventory.",
                    name: "productname",
                    choices: function () {
                        var products = [];
                        for (var i = 0; i < results.length; i++) {
                            products.push(results[i].product_name);
                        }
                        return products;
                    }
                },
                {
                    type: "input",
                    message: "How many would you like to add?",
                    name: "addinventory"
                }
            ])

            .then(function (answer) {

                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.productname) {
                        newInventoryTotal = results[i].stock_quantity + parseInt(answer.addinventory);
                    }
                };
                connection.query(
                    "UPDATE products SET ? WHERE ?", [{
                            stock_quantity: newInventoryTotal
                        },
                        {
                            product_name: answer.productname
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Inventory of " + answer.productname + " has been changed to " + newInventoryTotal + ".");
                    }
                )
            });
    });
};

function addNewProduct() {
    console.log("Follow the prompts to create new inventory item.")
    inquirer
        .prompt([{
                type: "input",
                message: "Please enter the id of the new item.",
                name: "itemid"
            },
            {
                type: "input",
                message: "Please enter the product name of the new item.",
                name: "productname"
            },
            {
                type: "input",
                message: "Please enter a department for the new item.",
                name: "department"
            },
            {
                type: "input",
                message: "Please enter the price of the new item.",
                name: "price"
            },
            {
                type: "input",
                message: "Please enter the initial inventory of the new item.",
                name: "quantity"
            },
        ])

        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?", {
                    item_id: answer.itemid,
                    product_name: answer.productname,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("Item successfully added.");
                }
            );
        })
};
setTimeout(managerMenu, 500);