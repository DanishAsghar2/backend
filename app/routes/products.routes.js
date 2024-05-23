const products = require("../controllers/products.controllers");

module.exports = function(app){
    app.route("/products")
        .get(products.getAll)
        .post(products.create);
    
    app.route("/products/:fragrance_id")
        .delete(products.deleteProduct)
        .get(products.getOne);

    app.route("/products/custom/:custom")
        .get(products.getByCustom);
}
