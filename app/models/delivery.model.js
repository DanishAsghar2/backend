const db = require("../../database");

const getAllDelivery = (done) => {
    const results = [];

    db.each(
        'SELECT * FROM delivery',
        [],
        (err, row) => {
            if (err) {
                console.log("Something went wrong: " + err);
                return;
            }

            results.push({
                delivery_id: row.delivery_id,
                first_name: row.first_name,
                last_name: row.last_name,
                addline1: row.addline1,
                addline2: row.addline2,
                townorcity: row.townorcity,
                postcode: row.postcode,
                phone: row.phone,
                country: row.country,
                user_id: row.user_id
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    );
};

const getDeliveryByUserID = (pos, done) => {
    const sql = "SELECT * FROM delivery WHERE user_id=?";
    db.all(sql, [pos], (err, rows) => {
        if(err) return done(err);
        return done(null, rows);
    })
}

const addDelivery = (deliveryItem, done) => {
    const sql = 'INSERT INTO delivery (first_name, last_name, addline1, addline2, townorcity, postcode, phone, country, user_id) VALUES (?,?,?,?,?,?,?,?,?)';
    const values = [deliveryItem.first_name, deliveryItem.last_name, deliveryItem.addline1, deliveryItem.addline2, deliveryItem.townorcity, deliveryItem.postcode, deliveryItem.phone, deliveryItem.country, deliveryItem.user_id];

    db.run(
        sql,
        values,
        function(err){
            if(err) return done(err, null);

            return done(null, this.lastID);
        }
    );
};

const removeDelivery = (delivery_id, done) => {
    const sql = 'DELETE FROM delivery WHERE delivery_id=?';
    const values = [delivery_id];

    db.run(sql, values, (err) => {
        return done(err);
    });
};

module.exports = {
    getAllDelivery:getAllDelivery,
    addDelivery:addDelivery,
    removeDelivery:removeDelivery,
    getDeliveryByUserID:getDeliveryByUserID
};
