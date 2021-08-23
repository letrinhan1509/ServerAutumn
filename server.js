const mysql = require('mysql');
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });

const app = require('./app');

// Connect to Google Cloud Platform:
const DB = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

DB.connect(function (err) {  
    if (err){
        console.log(err);
        console.log('Database is connected fail! Please check the connection again!');
    } else
        console.log('Database is connected successfully!');
});

// Start the server
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Sever is listening on port ${port}...`)
});