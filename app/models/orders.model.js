const db = require("../../database");

const getAll = (done) => {
    const results = [];

    db.each(
        'SELECT * FROM orders',
        [],
        (err, row) => {
            if (err) {
                console.log("Something went wrong: " + err);
                return;
            }

            results.push({
                order_id: row.order_id,
                fragrance_id: row.fragrance_id,
                delivery_id: row.delivery_id,
                billing_id: row.billing_id,
                user_id: row.user_id,
                order_num: row.order_num
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    );
};

const getOrderByUserID = (pos, done) => {
    const sql = "SELECT * FROM orders WHERE user_id=?";
    db.all(sql, [pos], (err, rows) => {
        if(err) return done(err);
        return done(null, rows);
    })
}

const getOrderByOrderNumber = (pos, done) => {
    const sql = "SELECT * FROM orders WHERE order_num=?";
    db.all(sql, [pos], (err, rows) => {
        if(err) return done(err);
        return done(null, rows);
    })
}

const create = (orderItem, done) => {
    const sql = 'INSERT INTO orders (fragrance_id, delivery_id, billing_id, user_id, order_num) VALUES (?,?,?,?,?)';
    const values = [orderItem.fragrance_id, orderItem.delivery_id, orderItem.billing_id, orderItem.user_id, orderItem.order_num];

    db.run(
        sql,
        values,
        function(err){
            if(err) return done(err, null);

            return done(null, this.lastID);
        }
    );
};

const removeOrder = (order_id, done) => {
    const sql = 'DELETE FROM orders WHERE order_id=?';
    const values = [order_id];

    db.run(sql, values, (err) => {
        return done(err);
    });
};

module.exports = {
    getAll:getAll,
    create:create,
    removeOrder:removeOrder,
    getOrderByUserID:getOrderByUserID,
    getOrderByOrderNumber:getOrderByOrderNumber
};
