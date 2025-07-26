import express from 'express';
import cors from 'cors'
import mysql from 'mysql2/promise';
const config = express.Router()
// configuration for requests from USer
config.use(express.json())
config.use(express.urlencoded({ extended: true }))
// configurations for the cors
config.use(cors({
    origin: "*",
    methods: "*",
}))
// connection to database
const db_con = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "quiz_app",
    waitForConnections: true
})
db_con.getConnection()
    .then((res) => console.log("connected to database"))
    .catch((err) => console.log(`error connected to database${err}`))
export { db_con }
export default config