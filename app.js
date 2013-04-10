var express = require('express');
var jade = require('jade');
var app = express();

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/js'));

app.register('.html', require('jade'));


app.get('/hello.txt', function(req, res){
  res.send('Hello World');
});

// controllers
// admin

app.get('/admin', function(req, res) {
	res.render('admin/index.html');
});







app.listen(8080);
console.log('Listening on port 8080');