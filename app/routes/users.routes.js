const auth = require("../lib/middleware");
const users = require("../controllers/users.controllers");

module.exports = function(app){
    app.route("/users")
        .get(users.getAll)
        .post(users.create);
    
    app.route("/users/:user_id")
        .delete(auth.isAuthenticated, users.deleteUser);

    app.route("/login")
        .post(users.login);
     
     app.route("/logout")
        .post(auth.isAuthenticated, users.logout);
}
