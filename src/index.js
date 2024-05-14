import express from 'express'
import dotenv from 'dotenv'
import { dBConnection } from './db/connection.js'
import bodyParser from 'body-parser'
dotenv.config()
const app = express()
const port = process.env.PORT
const StartServer = async () => {
     await dBConnection()
     app.use(bodyParser.json())
     app.use(bodyParser.urlencoded({ extended: true }))
     app.listen(port, () => {
          console.log(`server is running on port ${port}`)
     })
}

StartServer()
