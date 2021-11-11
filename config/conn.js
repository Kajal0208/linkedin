const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'vn-academy-dev.cluster-chqyq3rs8gxt.us-east-1.rds.amazonaws.com',
    user: 'vn_academy_dev',
    password: 'hSR3922gsf29',
    database: 'api',
    port:3306
});
// connection
connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });

  module.exports= connection;