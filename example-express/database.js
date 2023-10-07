import mysql from "mysql2/promise"

export const db_conn = mysql.createPool({
    host: "localhost",
    user: "mc-user",
    password: "abc123",
    database: "minute-coffee",
})
