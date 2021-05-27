'use strict';
const db = require('./db');
const bcrypt = require('bcrypt');


// DAO operations for validating users

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err); // DB error
            else if (row === undefined)
                resolve(false); // user not found
            else {
                bcrypt.compare(password, row.password).then(result => {
                    if (result) // password matches
                        resolve({id: row.id, username: row.email, name=row.name});
                    else
                        resolve(false); // password not matching
                })
            }
        });
    });
};