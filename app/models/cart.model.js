const db = require("../../database");

const getAllCart = (done) => {
    const results = [];

    db.each(
        'SELECT * FROM cart',
        [],
        (err, row) => {
            if (err) {
                console.log("Something went wrong: " + err);
                return;
            }

            results.push({
                cart_id: row.cart_id,
                fragrance_id: row.fragrance_id,
                price: row.price,
                user_id: row.user_id,
                quantity: row.quantity,
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    );
};

const getCartByUserID = (pos, done) => {
    const sql = "SELECT * FROM cart WHERE user_id=?";
    db.all(sql, [pos], (err, rows) => {
        if(err) return done(err);
        return done(null, rows);
    })
}

const addItemToCart = (cartItem, done) => {
    const sql = 'INSERT INTO cart (fragrance_id, price, user_id, quantity) VALUES (?,?,?,?)';
    const values = [cartItem.fragrance_id, cartItem.price, cartItem.user_id, cartItem.quantity];

    db.run(
        sql,
        values,
        function(err){
            if(err) return done(err, null);

            return done(null, this.lastID);
        }
    );
};

const removeItemFromCart = (cart_id, done) => {
    const sql = 'DELETE FROM cart WHERE cart_id=?';
    const values = [cart_id];

    db.run(sql, values, (err) => {
        return done(err);
    });
};

module.exports = {
    getAllCart:getAllCart,
    addItemToCart:addItemToCart,
    removeItemFromCart:removeItemFromCart,
    getCartByUserID:getCartByUserID
};
