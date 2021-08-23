const { json } = require('body-parser');
var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'autumn_shop'
})

db.connect(function (err) {  
    if (err){
        console.log(err);
        console.log('Database is connected fail! Please check the connection again! Exiting now...');
        //process.exit();
    } else
        console.log('Database is connected successfully!');
});

module.exports = db;