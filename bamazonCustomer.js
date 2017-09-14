var mysql = require("mysql");
var inquirer = require("inquirer");
var link = require("./bamazonConnect.js");

var connection = mysql.createConnection({
  host: link.connection.host,
  port: link.connection.port,
  user: link.connection.user,
  password: link.connection.password,
  database: link.connection.database
});

function postItems() {
  connection.connect(function(err) {
    if (err) {
      return console.log(err);
    }
    var query = connection.query(
      "SELECT * FROM bamazon.products",
      function(err, res) {
        if (err) {
          return console.log(err);
        }
        for (var i = 0; i < res.length; i++) {
          var item = res[i];
          console.log("Item #" + item.item_id + ":", item.product_name, "|", item.department_name);
          console.log("Price: $" + item.price.toFixed(2));
          if (item.stock_quantity > 0) {
            console.log("In Stock:", item.stock_quantity);
          } else {
            console.log("Out of Stock!");
          }
          console.log("------------------------------");
        }
        askOrder();
      }
    );
  });
}

function askOrder() {
  inquirer.prompt([
    {
      name: "item",
      message: "What Item Number would you like to order?"
    },{
      name: "quantity",
      message: "How many would you like to order?"
    }
  ]).then(function(order) {
    var item = parseInt(order.item - 1);
    var quantity = parseInt(order.quantity);

    if ((Number.isInteger(item)) && (Number.isInteger(quantity))) {
      if (quantity < 1) {
        console.log("Please order a positive number of items.");
        askOrder();
      } else {
        orderProduct(item, quantity);
      }
    } else {
      console.log("Please type in a number.");
      askOrder();
    }
  });
}

function orderProduct(item, quantity) {
  var query = connection.query(
    "SELECT * FROM bamazon.products",
    function(err, res) {
      if (err) {
        return console.log(err);
      }
      if (quantity <= res[item].stock_quantity) {
        var catNum = parseInt(item + 1);
        var oldStock = parseInt(res[item].stock_quantity);
        var totalCost = res[item].price * quantity;

        console.log("Your", res[item].product_name, "order has been sent!");
        console.log("Your total cost is $" + totalCost);
        console.log("Thank you for ordering!");
        moveProduct(catNum, oldStock, quantity);
        connection.end();
      } else {
        console.log("Insufficient quantity! Please try again.");
        askOrder();
      }
    }
  );
}

function moveProduct(item, stock, sold) {
  var query = connection.query(
    "UPDATE bamazon.products SET ? WHERE ?",
    [
      {
        stock_quantity: stock - sold
      },{
        item_id: item,
      }
    ],
    function(err, res) {
      if (err) {
        return console.log(err);
      }
    }
  );
}

postItems();