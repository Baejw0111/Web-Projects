const mysql = require("mysql2/promise");

// DB 연결 정보 셋팅

const pool = mysql.createPool({
    // AWS HOST
    host: "43.200.245.235",
    user: "ssafy",
    password: "ssafy1234",
    database: "order_system",
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
});

// module.exports = {pool}; -> 받아올 때 const {pool} = require("./db/index.js");
module.exports = pool; // 받아올 때 const pool(다른 변수 가능) = require("./db/index")