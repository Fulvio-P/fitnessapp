var express = require('express');
var path = require('path');
var history = require('connect-history-api-fallback');

app = express();

const staticFileMiddleware = express.static(path.join(__dirname + '/dist'));

app.use(staticFileMiddleware);
app.use(history({
  verbose: true
}));
app.use(staticFileMiddleware);

app.get('/', function (req, res) {
    res.render(path.join(__dirname + '/dist'));
});


var port = 8080;


app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}/`);
});