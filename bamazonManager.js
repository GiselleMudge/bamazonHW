// Ensuring dependencies are set up, packages have been downloaded prior to this
var inquirer = require('inquirer'); 
var mysql = require('mysql');
var Table = require('cli-table'); // according to a hint from Alex, there was some neat table package out there
const chalk = require('chalk'); // something cool to modify output appearance in VSC

// Revving our connection engines
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "password", //my MYSQL established password 
    database: "bamazon" //name of DB per HW instructions and the one set up in MYSQL
})

// Manager function begins here! 
var managerView = function() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: chalk.bgCyan.yellow.underline("Greetings Communications or Anthropology major. What higher paygrade function would you like to achieve today?"),
// Choices are based on HQ instructions, but added an escape option in case the user does not know how to do Ctl+clear to reset
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
    }).then(function(answer) {
// Setting up our switch statements, establishing our cases as functions to be run to match our choices
        switch (answer.action) {
            case 'View Products for Sale':
            inventoryAll(function() {
                    managerView();
                });
                break;

            case 'View Low Inventory':
                inventoryLow(function() {
                    managerView();
                });
                break;

            case 'Add to Inventory':
                inventoryAdd(function() {
                    managerView();
                });
                break;

            case 'Add New Product':
                addNewProd(function() {
                    managerView();
                });
                break;
    // Option to disconnect from node
            case 'EXIT':
                connection.end();
                break;
        }
    })
};


// Function to list every available item: the item IDs, names, prices, and quantities
var inventoryAll = function(cb) {
    connection.query('SELECT * FROM products', function(err, res) {
   // Sets up table for our raw data already populated within MYSQL Workbench
        var table = new Table({
            head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
        });
        // displays all current inventory in a fancy shmancy table thanks to cli-table package
        console.log(chalk.blue("CURRENT INVENTORY FOR SALE: "));
        console.log("===========================================");
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        console.log("-----------------------------------------------");
        cb();
    })
}

// Function to list all items with an inventory count < 5 
function inventoryLow(cb) {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5',
        function(err, res) {
            if (err) throw err;
            //If there is NO low inventory, display this custom message
            if (res.length === 0) {
                console.log(chalk.bgGreen.yellow.bold("Inventory levels are healthy. Better up your sales game bro."))
                cb();
            } else {
                // Sets up table for our raw data already populated within MYSQL Workbench
                var table = new Table({
                    head: ['ID', 'Product Name', 'Department', 'Price', 'Stock Quantity']
                });

                // displays all low inventory items in a fancy shmancy table thanks to cli-table package
                for (var i = 0; i < res.length; i++) {
                    table.push([res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
                }
                console.log(table.toString());
                console.log(chalk.red('These items are low on inventory. REORDER!'));
                cb();
            }
        });
}

// Function to add inventory to current on hand 
function inventoryAdd() {
// prompts to request required data to adjust the on hand
        inquirer.prompt([{
            name: "id",
            type: "input",
            message: " Enter the ID number of the item you wish to add:   ",
        }, {
            name: "quantity",
            type: "input",
            message: " Enter total units you wish to add:  ",
    
        // Connects to MySQL to parse and update the total qty in producsts table
        }]).then(function(answer) {
            connection.query('SELECT * FROM products WHERE ?', {id: answer.id},function(err,res) {
                itemQuantity = res[0].stock_quantity + parseInt(answer.quantity);
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: itemQuantity
                }, {
                    id: answer.id
                }], function(err, results) {});
      // Custom message to alert user that addition was a success
                connection.query('SELECT * FROM products WHERE ?', {id: answer.id},function(err,results) {
                    console.log(chalk.bgYellow.red('Total units for your requested item is now updated!'));  
                    // disconnects upon completion
                    connection.end()
                });
    
            });
        });
    }   

// Function to allow the manager to add a completely new product to the store
function addNewProd() {
    //Prompts which the user must input to complete each required field of data to populate the DB
    inquirer.prompt([{
        name: 'item',
        type: 'text',
        message: 'Enter the name of the new item you wish to add:   '
    }, {
        name: 'department',
        type: 'text',
        message: 'Enter the name of the department you wish to add this new item to:  ',
    }, {
        name: 'price',
        type: 'input',
        message: 'Enter Per Unit price.'
    }, {
        name: 'stock',
        type: 'text',
        message: 'Enter the QTY of the new item you wish to add into Current Inventory:   '
    }]).then(function(answer) {
        //Creating object for the new item to be added
        connection.query("INSERT INTO products SET ?", {
                product_name: answer.item,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.stock
        // display success message upon completion
         }, function(err, res) {
                if (err) throw err;
                console.log(chalk.bgYellow.blue(answer.item + ' is now in your inventory boss!'));
                //Returns to Manager menu upon completion
                managerView();
            });
    });
}

managerView();