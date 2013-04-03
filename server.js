var http = require('http');
var fs = require('fs');
var router = require('router');
var route = router();

// css files

route.get('/css/bootstrap.min.css', function(req, res) {
    fs.readFile('css/bootstrap.min.css', function(error, css){
      res.writeHead(200, {'Content-Type': 'text/css','Content-Length':css.length});
      res.write(css);
      res.end();
    });
});

route.get('/css/bootstrap-responsive.min.css', function(req, res) {
    fs.readFile('css/bootstrap-responsive.min.css', function(error, css){
      res.writeHead(200, {'Content-Type': 'text/css','Content-Length':css.length});
      res.write(css);
      res.end();
    });
});

route.get('/css/main.css', function(req, res) {
    fs.readFile('css/main.css', function(error, css){
      res.writeHead(200, {'Content-Type': 'text/css','Content-Length':css.length});
      res.write(css);
      res.end();
    });
});

// js files

route.get('/js/vendor/modernizr-2.6.2-respond-1.1.0.min.js', function(req, res) {
    fs.readFile('js/vendor/modernizr-2.6.2-respond-1.1.0.min.js', function(error, js){
      res.writeHead(200, {'Content-Type': 'application/javascript','Content-Length':js.length});
      res.write(js);
      res.end();
    });
});

route.get('/js/vendor/jquery-1.9.1.min.js', function(req, res) {
    fs.readFile('js/vendor/jquery-1.9.1.min.js', function(error, js){
      res.writeHead(200, {'Content-Type': 'application/javascript','Content-Length':js.length});
      res.write(js);
      res.end();
    });
});

route.get('/js/vendor/bootstrap.min.js', function(req, res) {
    fs.readFile('js/vendor/bootstrap.min.js', function(error, js){
      res.writeHead(200, {'Content-Type': 'application/javascript','Content-Length':js.length});
      res.write(js);
      res.end();
    });
});

route.get('/js/plugins.js', function(req, res) {
    fs.readFile('js/plugins.js', function(error, js){
      res.writeHead(200, {'Content-Type': 'application/javascript','Content-Length':js.length});
      res.write(js);
      res.end();
    });
});

route.get('/js/admin.js', function(req, res) {
    fs.readFile('js/main.js', function(error, js){
      res.writeHead(200, {'Content-Type': 'application/javascript','Content-Length':js.length});
      res.write(js);
      res.end();
    });
});

// controllers
// admin

route.get('/admin', function(req, res) {
    fs.readFile('admin/index.html', function(error, html){
      res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
      res.write(html);
      res.end();
    });
});

route.get('/admin/games', function(req, res) {
    fs.readFile('admin/games.html', function(error, html){
      res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
      res.write(html);
      res.end();
    });
});

// client

route.get('/', function(req, res) {
    fs.readFile('index.html', function(error, html){
      res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
      res.write(html);
      res.end();
    });
});

route.get('/hello', function(req, res) {
    res.writeHead(200);
    res.end('hello there');
});

route.get('/{x}x{y}', function(req, res) {
  var x = req.params.x;
  var y = req.params.y;
  // if the path was /200x200, then req.params = {x:'200', y:'200'}
  res.writeHead(200);
  res.end('x =' + x + ' y = ' + y);
});

route.get('/user/{id}', function(req, res) {
    var id = req.params.id;
    res.writeHead(200);
    res.end('user ' + id);
});

// route.get('/{name}', function(req, res) {
//     var name = req.params.name; // ex: if the path is /foo/bar, then base = foo
//     res.writeHead(200);
//     res.end('hello ' + name);
// });

route.get(function(req, res) {
    fs.readFile('404.html', function(error, html){
      res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
      res.write(html);
      res.end();
    }); 
});

console.log('Starting server...');
http.createServer(route).listen(8080); // start the server on port 8080
