 //imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


//initializing server
const app = express();

//middleware
app.use(bodyParser.json());
app.use(cors());

//routes
const weight = require("./routes/api/weight");
app.use("/api/weight/", weight);

const calories = require("./routes/api/calories");
app.use("/api/calories", calories);

//starting server
const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`Server started on port ${port}`)});