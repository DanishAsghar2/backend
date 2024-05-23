const billing = require("../controllers/billing.controllers");

module.exports = function(app){
    app.route("/billing")
        .get(billing.getAllBilling)
        .post(billing.addBilling);
    
    app.route("/billing/:billing_id")
        .delete(billing.removeBilling);
    
    app.route("/billing/user/:user_id")
        .get(billing.getByUserID);
}
