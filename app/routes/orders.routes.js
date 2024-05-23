const order = require("../controllers/orders.controllers");

module.exports = function(app){
    app.route("/orders")
        .get(order.getAll)
        .post(order.create);
    
    app.route("/orders/:order_id")
        .delete(order.removeOrder);
    
    app.route("/orders/user/:order_id")
        .get(order.getByUserID);

    app.route("/orders/order/:order_num")
        .get(order.getByOrderNumber);
}
