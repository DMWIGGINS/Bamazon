// npm packages needed to run app
var mysql = require("mysql");
var inquirer = require("inquirer");

// create connection to mysql to store, get and manipulate information
var connection = mysql.createConnection({
    host: "localhost",
    port: 3000,
    user: "root",
    password: "root",
    database: "bamazonDB"
});

// show id of successful connection or if error connecting throw error 
connection.connect(function (err) {
    if (err) throw err
    console.log("connected as id " + connection.threadId);
})

// function managerMenu to give the user the four options to choose from
function managerMenu() {
    inquirer
        .prompt([{
            type: "list",
            message: "Please choose an option from the list.",
            name: "managerchoice",
            choices: ["View Products", "Low Inventory", "Add Inventory", "Add New Product"]
        }])

        // run appropriate function based on what user has selected above

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

// if user chooses viewProducts we will pull product data for all products in our mysql table and display it
function viewProducts() {

    // get all products from table and go through them all displaying each piece of info 

    connection.query("SELECT * FROM products", function (err, res) {

        // throw err if error

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

// for lowInventory we get info from mysql database about which items have less than 5 in stock and display that info
function lowInventory() {

    // gather all product info from mysql table

    connection.query("SELECT * FROM products", function (err, res) {
        console.log("These items have less than five in available inventory");
        console.log("------------------------------------------------------");

        // check each products inventory for those with less than 5

        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                var itemMatch = 1;

                // display information about products found with less than 5
                console.log("Product Name: " + res[i].product_name);
                console.log("Item Number: " + res[i].item_id);
                console.log("Quantity in Stock: " + res[i].stock_quantity);
                console.log("----------------------------------------------");
            }
        };
        if (itemMatch != 1) {

            // return message if there are no products with less than 5 in stock

            console.log("There are no products with less than 5 in stock.");
        };

    });

};

// addInventory walks the user through choosing the product to add to from a list and then asking how many items to add
function addInventory() {

    // start by getting products from database so we can use them to make our list of selections 

    connection.query("SELECT * FROM products", function (error, results) {

        // show if 

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

            // we take the answer chosen and compare it to the results to find the product that we want to update

            .then(function (answer) {

                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.productname) {

                        // adding new inventory to existing 

                        newInventoryTotal = results[i].stock_quantity + parseInt(answer.addinventory);
                    }
                };
                // connecting to mysql and updating the item inventory 

                connection.query(
                    "UPDATE products SET ? WHERE ?", [{
                            stock_quantity: newInventoryTotal
                        },
                        {
                            product_name: answer.productname
                        }
                    ],
                    function (error) {

                        // show if error

                        if (error) throw err;

                        // show user the new total inventory of the product

                        console.log("Inventory of " + answer.productname + " has been changed to " + newInventoryTotal + ".");
                    }
                )
            });
    });
};

// addNewProduct allows user to add a brand new product to the store
function addNewProduct() {
    console.log("Follow the prompts to create new inventory item.")

    // we will prompt the user for the new product information

    inquirer
        .prompt([{
                type: "input",
                message: "Please enter the id of the new item.",
                name: "itemid",
                // requiring something to be entered
                validate: function (input) {
                    return input !== "";
                }
            },
            {
                type: "input",
                message: "Please enter the product name of the new item.",
                name: "productname",
                // requiring something to be entered
                validate: function (input) {
                    return input !== "";
                }
            },
            {
                type: "input",
                message: "Please enter a department for the new item.",
                name: "department",
                // requiring something to be entered
                validate: function (input) {
                    return input !== "";
                }
            },
            {
                type: "input",
                message: "Please enter the price of the new item.",
                name: "price",
                // requiring something to be entered
                validate: function (input) {
                    return input !== "";
                }
            },
            {
                type: "input",
                message: "Please enter the initial inventory of the new item.",
                name: "quantity",
                // requiring something to be entered
                validate: function (input) {
                    return input !== "";
                }
            },
        ])

        // we take the answers and send it to mysql to be inserted as a new line in our products table
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

                    // show if error

                    if (err) throw err;

                    // let the user know that the new item has been added to the table successsfully

                    console.log("Item successfully added.");
                }
            );
        })
};

// we tell the function managerMenu to run but delay it 1/2 second so the connection to mysql has time to be established
setTimeout(managerMenu, 500);