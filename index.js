const express = require('express')
const bodyParser = require('body-parser')
const userRouters = require('./routes/users')
let app = express()
require('./database/sequelize')
const port = process.env.PORT || 3000
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/user', userRouters)

app.listen(port, () => console.log(`Express server currently running on port ${port}`))