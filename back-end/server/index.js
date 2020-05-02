 //imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//initializing server
const app = express();

//middleware
app.use(bodyParser.json());
app.use(cors());


//starting server
const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`Sever started on port ${port}`)});


//handling requests
app.get("/", (req, res)=>{
    res.send("pippo");
})

app.post("/weight" , (req, res) => {
    console.log(req);
})

app.post("/food", (req, res) => {
    console.log(req);
})

app.post("/activities", (req, res) => {
    console.log(req);
})