const mysql  = require('mysql');
const dotenv = require('dotenv');  
dotenv.config();   

const connection = mysql.createConnection({
    host: process.env.DBHost, 
    port:process.env.DBPort, 
    user: process.env.DBUser, 
    password: process.env.DBPass, 
}); // DB와 서버를 연결하는 객체 생성

connection.connect(); // 실제로 데이터 교환을 위해 DB와 연결

module.exports = connection; 