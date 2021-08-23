const { json } = require('body-parser');
var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

var db = mysql.createConnection({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'baa60606e1c399',
    password: 'f324ba4b',
    database: 'heroku_a6274c980699ab6'
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