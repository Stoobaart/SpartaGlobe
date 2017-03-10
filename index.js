var express = require("express")
var app = express()

app.use(express.static(__dirname + "/public"))

app.get('/', function(req, res, next) {
  res.sendFile('index.html')
})

app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})

