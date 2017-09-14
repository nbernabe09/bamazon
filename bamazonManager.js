var mysql = require("mysql");
var inquirer = require("inquirer");
var link = require("./bamazonConnect.js");
var fs = require("fs");

var connection = mysql.createConnection({
  host: link.connection.host,
  port: link.connection.port,
  user: link.connection.user,
  password: link.connection.password,
  database: link.connection.database
});

function mainMenu() {
  inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do today?",
    choices: [{name: "View Products for Sale", value: 1},
              {name: "View Low Inventory", value: 2},
              {name: "Add to Inventory", value: 3},
              {name: "Add New Product", value: 4},
              {name: "Quit", value: 5}]
  }).then(function(ans) {
    if (ans.action === 1) {
      showInventory();
    } else if (ans.action === 2) {
      showLow();
    } else if (ans.action === 3) {
      askStock();
    } else if (ans.action === 4) {
      askProduct();
    } else if (ans.action === 5) {
      console.log("Thank you for using Bamazon Manager!");
      connection.end();
    }
  });
}

function showInventory() {
  var query = connection.query(
    "SELECT * FROM bamazon.products",
    function(err, res) {
    if (err) {
      return console.log(err);
    }
    for (var i = 0; i < res.length; i++) {
      var item = res[i];
      console.log("Item #" + item.item_id + ":", item.product_name);
      console.log("Price: $" + item.price.toFixed(2));
      if (item.stock_quantity > 0) {
      console.log("In Stock:", item.stock_quantity);
      } else {
      console.log("Out of Stock!");
      }
      console.log("------------------------------");
    }
    mainMenu();
    }
  );
}

function showLow() {
  var query = connection.query(
    "SELECT product_name, stock_quantity FROM bamazon.products HAVING stock_quantity < 5 ORDER BY stock_quantity DESC",
    function(err, res) {
    if (err) {
      return console.log(err);
    }
    for (var i = 0; i < res.length; i++) {
      var item = res[i];
      console.log("Item #" + item.item_id + ":", item.product_name, "has", item.stock_quantity, "left in stock!");
      console.log("------------------------------");
    }
    mainMenu();
    }
  );
}

function askStock() {
  inquirer.prompt([
    {
      name: "item",
      message: "What Item Number would you like to add more to?"
    },{
      name: "quantity",
      message: "How much inventory would you like to add?"
    }
  ]).then(function(stock) {
    var item = parseInt(stock.item - 1);
    var quantity = parseInt(stock.quantity);

    if ((Number.isInteger(item)) && (Number.isInteger(quantity))) {
      if (quantity < 1) {
        console.log("Please add a positive number of items.");
        askStock();
      } else {
        addStock(item, quantity);
      }
    } else {
      console.log("Please type in a number.");
      askStock();
    }
  });
}

function addStock(item, quantity) {
  var query = connection.query(
    "SELECT * FROM bamazon.products",
    function(err, res) {
      if (err) {
        return console.log(err);
      }
      var catNum = parseInt(item + 1);
      var newStock = parseInt(res[item].stock_quantity + quantity);

      console.log("Your", res[item].product_name, "stock has been updated!");
      console.log("Your new stock is", newStock);
      modifyStock(catNum, newStock);
      mainMenu();
    }
  );
}

function modifyStock(item, add) {
  var query = connection.query(
    "UPDATE bamazon.products SET ? WHERE ?",
    [
      {
        stock_quantity: add
      },{
        item_id: item
      }
    ],
    function(err, res) {
      if (err) {
        return console.log(err);
      }
    }
  );
}

function askProduct() { 
  fs.readFile("departments.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
      }
    var choices = data.split("|");

    inquirer.prompt([
      {
        name: "productName",
        message: "What is the name of the new product?"
      },{
        name: "departmentName",
        type: "list",
        message: "What department category does this item fall under?",
        choices: choices
      },{
        name: "price",
        message: "How much does this product cost?"
      },{
        name: "stockQuantity",
        message: "How much of this product do you want to sell?"
      }
    ]).then(function(item) {
      addProduct(item);
    });
  });
}

function addProduct(item) {
  var query = connection.query(
    "INSERT INTO bamazon.products SET ?",
    {
      product_name: item.productName,
      department_name: item.departmentName,
      price: item.price,
      stock_quantity: item.stockQuantity
    },
    function(err, res) {
      if (err) {
        return console.log(err);
      }
      console.log(item.productName, "has been added to the store!");
      mainMenu();
    }
  );
}

console.log("Welcome to Bamazon Manager!");

connection.connect(function(err) {
  if (err) {
    return console.log(err);
  }
});

mainMenu();