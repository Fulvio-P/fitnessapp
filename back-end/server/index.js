 //imports
const express = require('express');
const bodyParser = require('body-parser');

//initializing server
const app = express();

//middleware
app.use(bodyParser.json());


//starting server
const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`Sever started on port ${port}`)});