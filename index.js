const express = require('express');
const sequelize = require('sequelize');
const db = require('./models')

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
})

db.sequelize.sync().then((req) => {
    app.listen(8000, () => {
        console.log("Server started running.")
    })
})