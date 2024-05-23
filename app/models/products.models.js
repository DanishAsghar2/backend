const db = require("../../database");

const getAllProducts = (done) => {
    const results = [];

    db.each(
        'SELECT * FROM products',
        [],
        (err, row) => {
            if(err) console.log("Something went wrong: " + err);

            results.push({
                fragrance_id: row.fragrance_id,
                name: row.name,
                price: row.price,
                type: row.type,
                description: row.description,
                base: row.base,
                heart: row.heart,
                top: row.top,
                custom: row.custom
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    )
}

const addNewProduct = (product, done) => {
    const sql = 'INSERT INTO products (name, price, type, description, base, heart, top, custom) VALUES (?,?,?,?,?,?,?,?)';
    const values = [product.name, product.price, product.type, product.description, product.base, product.heart, product.top, product.custom];

    db.run(
        sql,
        values,
        function(err){
            if(err) return done(err, null);

            return done(null, this.lastID);
        }
    )
}

const getSingleProduct = (id, done) => {
    const sql = 'SELECT * FROM products WHERE fragrance_id=?'

    db.get(sql, [id], (err, row) => {
        if(err) return done(err);
        if(!row) return done(404);

        return done(null, {
            fragrance_id: row.fragrance_id,
            name: row.name,
            price: row.price,
            type: row.type,
            description: row.description,
            base: row.base,
            heart: row.heart,
            top: row.top,
            custom: row.custom
        });
    })
}

const getByCustom = (custom, done) => {
    const results = [];

    db.each(
        'SELECT * FROM products WHERE custom=?', [custom],
        [],
        (err, row) => {
            if(err) console.log("Something went wrong: " + err);

            results.push({
                fragrance_id: row.fragrance_id,
                name: row.name,
                price: row.price,
                type: row.type,
                description: row.description,
                base: row.base,
                heart: row.heart,
                top: row.top,
                custom: row.custom
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    )
}

const deleteProduct = (id, done) => {
    const sql = 'DELETE FROM products WHERE fragrance_id=?'
    
    let values = [id];

    db.run(sql, values, (err) => {
        return done(err);
    })
}


module.exports = {
    getAllProducts: getAllProducts,
    addNewProduct: addNewProduct,
    deleteProduct: deleteProduct,
    getSingleProduct: getSingleProduct,
    getByCustom: getByCustom
}
