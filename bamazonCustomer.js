// Ensuring dependencies are set up, packages have been downloaded prior to this
var inquirer = require('inquirer'); 
var mysql = require('mysql');
var Table = require('cli-table'); // according to a hint from Alex, there was some neat table package out there
const chalk = require('chalk'); // something cool to modify output appearance in VSC

// global variables
var itemToBuy = "";
var quantityToBuy = 0;

// Revving our connection engines
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "password", //my MYSQL established password 
    database: "bamazon" //name of DB per HW instructions and the one set up in MYSQL
})

connection.connect(function (err) {
    if (err) throw err;
    // un-comment line below when need to check connection
    // console.log('connected as id ' + connection.threadId + "\n");

    // call 1st function when connection is made
    viewAll();
});

// View on hand inventory table
function viewAll() {
    connection.query('SELECT * FROM products', function(err, res) {
        // Sets up table for our raw data already populated within MYSQL Workbench
        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
        });

        // displays all current inventory in a fancy shmancy table thanks to cli-table package
        console.log(chalk.blue("CURRENT INVENTORY, HOT HOT HOT!!!"));
        console.log("===========================================================================================");
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity]);
        }
        console.log("-------------------------------------------------------------------------------------------");
        console.log(table.toString());
                // call next function
                whatToBuy();
            })
        };
// Shopping function begins here!  
        // Custom message to request user to enter an item ID
function whatToBuy() {
    inquirer.prompt([
        {
            type: "input",
            name: "itemID",
            message: "Enter the Item ID of the item would you like to purchase",
            validate: function (input) {
                if (isNaN(input)) {
                    return "Enter the product number";
                } else {
                    return true;
                }
            }
        }
    ]).then(function (user) {
        itemToBuy = user.itemID;
        // after user input is entered, call checkIfItem function
        checkIfItem();
    });
};

// function to check if valid item #
function checkIfItem() {
    // query bamazon DB for the entered item
    connection.query("SELECT id FROM products WHERE id=?", [itemToBuy], function (err, res) {
        if (err) throw err;
        // if itemToBuy exists in the databse, call howManyToBuy function
        else if (res[0].id == itemToBuy) {
            // call update Quantity function
            howManyToBuy();
        }
        // if item does not exist in database, ask user to enter valid ID and go back to product list
        else {
            console.log(chalk.bgRed.yellow("Please enter a valid item ID!"));
            console.log('\n*******************');
        }
    });
}

// function to ask the user how much they would like to purchase
function howManyToBuy() {
    inquirer.prompt([
        {
            type: "input",
            name: "quantityToBuy",
            message: "How many would you like to purchase?",
            validate: function (input) {
                if (isNaN(input)) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then(function (user) {
        quantityToBuy = parseInt(user.quantityToBuy);
        // after user input is entered, call checkIfAvailable function
        checkIfAvailable();
    });
};

// function to check if sufficient quantity of item
function checkIfAvailable() {
    // query bamazon DB for the entered item and available quantity
    connection.query("SELECT stock_quantity, product_name, price FROM products WHERE id=?", [itemToBuy], function (err, res) {
        if (err) throw err;
        // if quantity entered is higher than quantity available, alert user there is insufficient stock then call viewAll function to start over
        else if (quantityToBuy > parseInt(res[0].stock_quantity)) {
            console.log(chalk.bgRed("Insufficient stock!"));
            console.log('\n*******************');
            viewAll();
        } else {
            // if quantity entered is equal or lower than quantity available, alert user of the purchase and total cost
            console.log("You successfully purchased " + quantityToBuy + " " + res[0].product_name);
            console.log(chalk.bgYellow.red("The total cost was: $" + (quantityToBuy * res[0].price)));
            console.log('\n*******************');
            // call update Quantity function
            updateQuantity();
        }
    });
}

// function to update quantity in MySql
function updateQuantity() {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
        [
            quantityToBuy,
            itemToBuy
        ],
        function (err, res) {
            if (err) throw err;
            updateProductSale();
        })
};

// function to update product sales
function updateProductSale() {
    // select the item in database
    connection.query("SELECT price, id FROM products WHERE id =?", [itemToBuy], function (err, res) {
        if (err) throw err;
        // update sales of item in database
        connection.query("UPDATE products SET product_sales=product_sales + ? WHERE id=?",
            [
                (parseFloat(res[0].price) * quantityToBuy),
                itemToBuy
            ],
            function (err, res) {
                if (err) throw err;
                viewAll();
            })
    }
    )
}