var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Forsaken1!",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  itemsForSale();
});

function itemsForSale() {
    console.log("Products for sale: ");
    connection.query("SELECT * FROM products", function(err, res){
        for (let i = 0; i < res.length; i++){
            console.log(`Product ID: ${res[i].item_id}`);
            console.log(`Product Name: ${res[i].product_name}`);
            console.log(`Product Price: ${res[i].price}`);
            console.log(`Product Stock: ${res[i].stock_quantity} \n`);
        }
        getResponse();
    });
}

function getResponse(){
    inquirer.prompt([
        // Here we create a basic text prompt.
        {
          type: "input",
          message: "Enter Product ID: ",
          name: "productID"
        },
        // Here we create a basic password-protected text prompt.
        {
          type: "input",
          message: "How many would you like to purchase? ",
          name: "unitToPurchase"
        }
    ]).then(function(inquirerResponse) {
            if (inquirerResponse) {
            connection.query(`SELECT product_name, price, stock_quantity FROM products WHERE item_id = ${inquirerResponse.productID};`,
            function (err, res){
                if (res[0].stock_quantity >= inquirerResponse.unitToPurchase){
                    
                    newStock = res[0].stock_quantity - inquirerResponse.unitToPurchase;
                    console.log("NEW STOCK TOTAL: " + newStock);
                    connection.query(`UPDATE products SET stock_quantity = ${newStock} WHERE item_id = ${inquirerResponse.productID};`,
                    function(err, res){
                        console.log("Thank you for your purchase!")
                        connection.end();
                    });
                } else {
                    console.log("Sorry, there isn't enough in stock!");
                    connection.end();
                }
            })
        }
      });
}
