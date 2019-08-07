//creating global variable 

var Table = require("cli-table");

var Mysql = require("mysql");
var inquirer = require("inquirer");

//lets connect :) !!

var connection = Mysql.createConnection ({
    host: "local host",
    
    port: "8080",

    user: "root",

    password: "root",

    database: "bamazonDB"

 });

  connection.connect(function(err) {
     if (err) throw err;
      console.log("connected as id" + connection.threadId);
       startPrompt ();

  });

    // inquirer here we go !

       function startPrompt() {
           
        inquirer.prompt([{

            type: "confirm",
            name: "confirm",
            message: "Welcome to Zohar's Bamazon! Wanna check it out?",
            default: true

        }]).then(function(user){
            if (user.confirm === true){
                inventory();
            } else {
                console.log("FINE.. come back soon")
          }
        });
    }
            // INVENTORY
     function inventory() {
         
        // instantiate

        var table = new Table({
            head: [ "ID", "Item", "Deparmtent", "Price", "Stock" ],
            colWidths: [ 10, 30, 30, 30]
        });
        
        listinventory();

        //  table is an Array, so you can `push`, `unshift`, `splice` and friends
        function listinventory() {

            //Variables from my DataBase
        
            connection.query("SELECT * FROM products", function(err,res) {
                for (var i = 0; i < res.lenght; i++) {

                    var itemId = res[i].item_id,
                        productName = res[i].product_name,
                        departmentName = res[i].department_name,
                        price = res[i].price,
                        stockQuantity = res[i].stock_quantity;

                        table.push(
                            [itemId, productName, departmentName, price, stockQuantity]
                        );
                }
                console.log("");
                console.log("============================ Zohars Bamazon inventory =================");
                console.log("");
                console.log(table.toString());
                console.log("");
                continuePrompt();
            });

            
        }
     }
            //inquirer user purchase
             
            function continuePrompt() {

                inquirer.prompt([{
                
                    type: "confirm",
                    name: "continue",
                    message: "Would you like to purchase something?",
                    default: true

                }]).then(function(user) {
                    if (user.contine === true) {
                        selectionPrompt();
                    } else {
                        console.log("FINE... come back later!");
                    }
                });
               
            }
         // Item Selection and Quantity

         function selectionPrompt() {
             inquirer.prompt([{

                type: "input",
                name: "inputId",
                message: "Please enter the ID of the item you would like to purchase.",
                 
             },
            {
                type: "input",
                name: "inputNumber",
                message: "How many units of this item would you like?",

            }
        ]).then(function(userPurchase) {

            //connect to databse to find the stock quantity in database.

            connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function(err, res){
                for (var i = 0; i < res.lenght; i++) {

                    if (user.inputNumber > res[i].stock_quantity) {

                        console.log("=================================");
                        console.log("So sorry! Not enough in stock. Try again Later.");
                        console.log("==================================");
                        startPrompt();

//list item informatiion for the user 

                    } else {
                        console.log("==================================");
                        console.log("Alright! lets get you checked out.");
                        console.log("===================================");
                        console.log("You have selected.");
                        console.log("------------------");
                        console.log("Item: " + res[i].product_name);
                        console.log("Department: " + res[i].department_name);
                        console.log("Price: " + res[i].price);
                        console.log("Quantity: " + userPurchase.inputNumber);
                        console.log("-------------");
                        console.log("Total: " + res[i].price + userPurchase.inputNumber);
                        console.log("===================================");

                        var newStock = (res(i).stock_quantity - userPurchase.inputNumber);
                        var purchasedId = (userPurchase.inputId);
                        confirmPrompt(newStock, purchasedId);
                    }

                }
            });
        });
         }

     //PURCHASE N STUFF

         function confirmPrompt(newStock, purchasedId) {

            inquirer.prompt([{

                type: "confirm",
                name: "confirmPurchase",
                messae: "Are you sure you want that item and quantity?",
                default: true

            }]).then(function(userConfirm) {
                if (userConfirm.confirmPurchase === true) {
                    connection.query("UPDATE products SET? WHERE?", [{
                        stock_quantity: newStock
                    },{
                        item_id: purchasedId
                    }], function(err, res){});
                    console.log("=====================================");
                    console,log("Transaction has been completed. Thank you");
                    console.log("========================================");
                    startPrompt();
                } else {
                    console.log("=====================================");
                    console.log("Fine...Maybe next time!");
                    console.log("==========================================");
                    startPrompt();
                }
            });
            app.listen(PORT, function() {
                console.log("App listening on PORT " + PORT);
              });
         }
    
        
        

  
      