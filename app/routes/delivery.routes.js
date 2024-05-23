const delivery = require("../controllers/delivery.controllers");

module.exports = function(app){
    app.route("/delivery")
        .get(delivery.getAllDelivery)
        .post(delivery.addDelivery);
    
    app.route("/delivery/:delivery_id")
        .delete(delivery.removeDelivery);
    
    app.route("/delivery/user/:user_id")
        .get(delivery.getByUserID);
}
