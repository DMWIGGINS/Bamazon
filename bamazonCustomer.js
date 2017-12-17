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
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

// function to show all products sold along with their item number and price per the mysql products database
function queryAllProducts() {
    // get all products with all info from database
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("Welcome to Bamazon!");
        console.log("Here is a list of items for sale.");
        console.log("----------------------------------");

        // display each product and related info
        for (var i = 0; i < res.length; i++) {
            console.log("Product Name: " + res[i].product_name);
            console.log("Item number: " + res[i].item_id);
            console.log("Price: $" + (res[i].price).toFixed(2));
            console.log("-----------------------------------");
        }
    });
};


// function to walk customer through purchasing an item by prompting for item number and quantity
function buyItem() {
    inquirer
        .prompt([{
                type: "input",
                message: "Please enter the 4-digit id of the product you would like to purchase.",
                name: "productid"
            },
            {
                type: "input",
                message: "Please enter the quantity you would like.",
                name: "quantity"
            },
        ])

        // takes customer order input and compares to database

        .then(function (answer) {
            connection.query("SELECT * FROM products", function (err, res) {

                // loops through product table to see if an item id matches the user input

                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id === parseInt(answer.productid)) {
                        var itemMatch = 1;

                        // checks to see if there is enough inventory to fulfill customer order

                        if ((res[i].stock_quantity - parseInt(answer.quantity) >= 0)) {
         
                            var itemsLeft = res[i].stock_quantity - parseInt(answer.quantity);
                            var totalCost = parseInt(answer.quantity) * res[i].price;
                            var productId = parseInt(answer.productid);
                            console.log("Your order has been placed.");
                            console.log("Your order total is  $" + totalCost.toFixed(2) + ".");
                            
                            // updates resulting inventory in products database

                            connection.query(
                                "UPDATE products SET ? WHERE ?", [{
                                        stock_quantity: itemsLeft
                                    },
                                    {
                                        item_id: productId
                                    }
                                ]);

                            // alerts customer if not enough in stock

                        } else {
                            console.log("Insufficient quantity available to fill this order.");
                        }
                    }
                };

                // alerts customer if item number entered is not found

                if (itemMatch != 1) {
                    console.log("Item not found.");
                };
            });
        });
};
 
// calls queryAllProducts to list items automatically when program is run
queryAllProducts();

// calls buyItem to run after a half second delay to prevent it from running before the connection is made and the           AllProducts list is shown
setTimeout(buyItem, 500);