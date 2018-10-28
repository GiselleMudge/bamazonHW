// Ensuring dependencies are set up, packages have been downloaded prior to this
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
const number = require('accounting');

var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root", 
        password: "password", //my MYSQL established password 
        database: "bamazon" //name of DB per HW instructions and the one set up in MYSQL
});
 
connection.connect(function(err) {
    if (err) throw err;
  
    // Lets supervisor pick action.
    supView();
  
  });

// Supervisor selects to view product sales or create department.
var supView = function() {
	inquirer.prompt([
	{
		type: 'list',
		name: 'action',
		message: 'What would you like to do?',
		choices: [
			"View Product Sales by Department",
			"Create New Department"
		]
	}
	]).then(function(answer) {

		// Functions called based on supervisor's selection.
		switch (answer.action) {
		    case "View Product Sales by Department":
		    	viewDeptSales();
		      	break;

		    case "Create New Department":
		    	newDept();
		      	break;
		}
	});
};

// Supervisor views product sales by department.
// The total profit is calculated based on total sales minus overhead costs.
// Total profit added to table using aliases.
var viewDeptSales = function(cb) {
    // create new table
        let query =  "SELECT d.department_id, d.department_name,  ";
            query +=  "SUM(p.product_sales) AS sales, d.over_head_costs,";
            query +=  "sum(p.product_sales) - d.over_head_costs AS gross_profit ";
            query +=  "FROM departments AS d ";
            query +=  "INNER JOIN products AS p ON d.department_name = p.department_name ";
            query +=  "GROUP BY d.department_name ";
            query +=  "ORDER BY p.product_sales DESC";
               
      connection.query(query, function (error, response){
        if(error) throw error;  
        let table = new Table ({ 
          head: ['Department ID', 'Department Name', 'Product Sales', 'Overhead Costs', 'Total Profit' ],  
        });
    
        for (let i = 0; i < response.length; i++) {
          table.push([response[i].department_id, response[i].department_name, '$' + response[i].sales, '$' + response[i].over_head_costs, '$' + response[i].gross_profit])   
        }           
        console.log(table.toString());
        supView();
      })
    }
    


//Supervisor creates new department.
var newDept = function() {
		inquirer.prompt([{
		name: "department_name",
		type: "input",
		message: "What is the new department name?"
	}, {
		name: "over_head_costs",
		type: "input",
		message: "What are the overhead costs for this department?"
	}]).then(function(answer) {

		// Department added to departments database.
		connection.query("INSERT INTO departments SET ?", {
			department_name: answer.department_name,
			over_head_costs: answer.over_head_costs
		}, function(err, res) {
			if (err) {
				throw err;
			} else {
				console.log("Your new department was added!");
				supView();
			}
		});
	});
};