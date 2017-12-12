var mysql = require("mysql");
var inquirer = require("inquirer");

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
});

// var allProducts = [];

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("Welcome to Bamazon!");
        console.log("Here is a list of items for sale.");
        console.log("----------------------------------");
        for (var i = 0; i < res.length; i++) {
            // allProducts.push(res[i].product_name);
            console.log("Product Name: " + res[i].product_name);
            console.log("Item number: " + res[i].item_id);
            console.log("Price: $" + (res[i].price).toFixed(2));
            console.log("-----------------------------------");
        }
        // console.log(allProducts);
        // return allProducts;
    });

};


// console.log(allProducts);

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
        .then(function (answer) {
            // console.log(answer.productid);
            connection.query("SELECT * FROM products", function (err, res) {

                for (var i = 0; i < res.length; i++) {
                    // console.log(res[i]);
                    if (res[i].item_id === parseInt(answer.productid)) {
                        var itemMatch = 1;
                        console.log("It worked!");
                        // console.log(res[i]);
                        // console.log(res[i].stock_quantity);
                        // console.log(parseInt(answer.quantity));
                        if ((res[i].stock_quantity - parseInt(answer.quantity) >= 0)) {
                            var itemsLeft = res[i].stock_quantity - parseInt(answer.quantity);
                            var totalCost = parseInt(answer.quantity) * res[i].price;
                            var productId = parseInt(answer.productid);
                            console.log("Your order has been placed.");
                            console.log("Your order total is  $" + totalCost.toFixed(2) + ".");
                            console.log(itemsLeft);
                            console.log(productId);
                            connection.query(
                                "UPDATE products SET ? WHERE ?", [{
                                        stock_quantity: itemsLeft
                                    },
                                    {
                                        item_id: productId
                                    }
                                ]);
                        } else {
                            console.log("Insufficient quantity available to fill this order.");
                        }
                    }
                };
                if (itemMatch != 1) {
                    console.log("Item not found.");
                };
            });
        });
};
queryAllProducts();
setTimeout(buyItem, 500);
