# Bamazon

This application mimics an online marketplace that we will call **Bamazon**.  
There are different uses depending on if you are accessing it as...

+ a customer
+ a manager
+ a supervisor

**Bamazon** uses *node*, *inquirer* and *MySQL* where the initial product inventory of the store is entered and updated.

Here is the initial database being loaded and run in MySQL...

[Initial Database](https://www.screencast.com/t/t5woaWcyrq0a)

Accessing Bamazon as a customer using bamazonCustomer.js will do the following..

1. Automatically display a list of all the products available for sale along with their item id and price.
2. Prompt the user to enter the item id and then the quantity of the product they would like to buy.  
3. Return a confirmation with the order total.
4. Update our database.
   
[Customer View](https://www.screencast.com/t/QlSpvEU0bP3)

Accessing Bamazon as a manager using bamazonManager.js will display a manager menu with 4 options

1. View Products
   Displays a list of all products in inventory and all related information from the database.

2. Low Inventory
   Returns a list of all products with less than 5 items in inventory, along with the item id and the actual number on hand.

3. Add Inventory
   Allows the manager to select a product and then add to it's inventory count. A confirmation message is returned with the product and new inventory that has been updated in the database.
   
4. Add New Product
   Prompts the manager to add item id, name of product, department it will listed under, sales price and initial inventory. A success message is returned when the database has been updated.










