# bamazonHW
Amazon-like user experience featuring Node.js &amp; MySQL

### Overview

Bamazon is an Amazon-like storefront delivered to you through the ever exciting command line! The app will take in orders from customers and deplete stock from the store's inventory. It also tracks product sales across your store's departments and then provide a summary of the highest-grossing departments in the store. Check out the demos below, but if you really want to see where the magic is check out the images folder and the source code in this project's repo!

### Prep Work

The following packages were downloaded:
*   mysql
*   inquire
*   cli-table (fancy table output for your data)
*   accounting (for number formatting)
*   Chalk (for formatting how responses on command line appear)
      
Database and tables created. View 'bamazonSeeds.sql' file for more details:
*   bamazon (db)
*   products (table). The products table should have each of the following columns:
     * item_id (unique id for each product)
     * product_name (Name of product)
     * department_name
     * price (cost to customer)
     * stock_quantity (how much of the product is available in stores)
*   departments (table). The departments table should have each of the following columns:
     * department_id
     * department_name
     * over_head_costs (A dummy number you set for each department)
   
## User Menus Overview

There are 3 node apps, 1 for each user. Each node app has functions specific to the respective user. More on each 
function in the next section below.

1. `bamazonCustomer.js`
2. `bamazonManager.js`
3. `bamazonSupervisor.js`

All the work was done for you! All the user needs to do is execute an 'npm install' in the command line before proceeding to test the commands. Next, user will need to enter the following in the command prompt, ignoring the "+":

node + 'One of the 3 node Titles mentioned above without any quotations'

### What Each Command Should Do

1. `bamazonCustomer.js`  Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.The app should then prompt users with two messages.
   * The first should ask them the ID of the product they would like to buy.
   * The second message should ask how many units of the product they would like to buy.

    Once the customer has placed the order, the app should check if your store has enough of the product to meet the customer's request.If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

    However, if your store _does_ have enough of the product, it will fulfill the customer's order.
   * This means updating the SQL database to reflect the remaining quantity.
   * Once the update goes through, it shows you the total cost of the purchase. 
   
See the demo below:

   ![custdemo](https://user-images.githubusercontent.com/41309640/47619537-2dacc300-dab6-11e8-964e-a5f68849ba6f.gif)

2. `bamazonManager.js` This Manager view allows the following 4 choices:
   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

See the demo below:
    ![mgmtdemo](https://user-images.githubusercontent.com/41309640/47620815-1923f700-dac5-11e8-9886-bdeff65f406d.gif)

3. `bamazonSupervisor.js`. Running this app will list a set of menu options:
   * View Product Sales by Department
   * Create New Department
    
    When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

                | department_id | department_name | over_head_costs | product_sales | total_profit |
                | ------------- | --------------- | --------------- | ------------- | ------------ |
                | 01            | Electronics     | 10000           | 20000         | 10000        |
                | 02            | Clothing        | 60000           | 100000        | 40000        |

    The `total_profit` column is calculated as the difference between `over_head_costs` and `product_sales`. `total_profit` is not stored in any database. A custom alias was used to make this possible.

See the final demo below. Thanks for reading!

![superdemo](https://user-images.githubusercontent.com/41309640/47621325-766f7680-dacc-11e8-873b-779de42fc3ef.gif)


-G$
