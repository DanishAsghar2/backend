const db = require("../../database");

const getAllBilling = (done) => {
    const results = [];

    db.each(
        'SELECT * FROM billing',
        [],
        (err, row) => {
            if (err) {
                console.log("Something went wrong: " + err);
                return;
            }

            results.push({
                billing_id: row.billing_id,
                card_number: row.card_number,
                expiry_date: row.expiry_date,
                cvv: row.cvv,
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

const getBillingByUserID = (pos, done) => {
    const sql = "SELECT * FROM billing WHERE user_id=?";
    db.all(sql, [pos], (err, rows) => {
        if(err) return done(err);
        return done(null, rows);
    })
}

const addBilling = (billingItem, done) => {
    const sql = 'INSERT INTO billing (card_number, expiry_date, cvv, first_name, last_name, addline1, addline2, townorcity, postcode, phone, country, user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    const values = [billingItem.card_number, billingItem.expiry_date, billingItem.cvv, billingItem.first_name, billingItem.last_name, billingItem.addline1, billingItem.addline2, billingItem.townorcity, billingItem.postcode, billingItem.phone, billingItem.country, billingItem.user_id];

    db.run(
        sql,
        values,
        function(err){
            if(err) return done(err, null);

            return done(null, this.lastID);
        }
    );
};

const removeBilling = (billing_id, done) => {
    const sql = 'DELETE FROM billing WHERE billing_id=?';
    const values = [billing_id];

    db.run(sql, values, (err) => {
        return done(err);
    });
};

module.exports = {
    getAllBilling:getAllBilling,
    addBilling:addBilling,
    removeBilling:removeBilling,
    getBillingByUserID:getBillingByUserID
};
