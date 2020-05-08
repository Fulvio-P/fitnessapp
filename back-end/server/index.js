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
const weight = require("./routes/weight");
app.use("/api/weight/", weight);

const calories = require("./routes/calories");
app.use("/api/calories", calories);

const auth = require("./routes/auth");
app.use("/api/user", auth);

const food = require("./routes/food");
app.use("/api/food", food);

const activities = require("./routes/activities");
app.use("/activities", activities);

//starting server
const port = process.env.PORT || 5000;
app.listen(port, () => { console.log(`Server started on port ${port}`)});