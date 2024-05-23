const cart = require("../controllers/cart.controllers");

module.exports = function(app){
    app.route("/cart")
        .get(cart.getAllCart)
        .post(cart.addToCart);
    
    app.route("/cart/:cart_id")
        .delete(cart.removeFromCart);
    
    app.route("/cart/user/:user_id")
        .get(cart.getByUserID);
}
