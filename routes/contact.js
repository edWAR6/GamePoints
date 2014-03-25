/* Eduardo Oviedo Blanco
 * eduardo.oviedo@gmail.com
 * user routes
 */
var comunication = require('comunication');

exports.sendemail = function(req, res){
  comunication.sendemail(req, res, 'eduardo.oviedo@gmail.com', function(err){
    if (err) {
      res.render('admin/contact', { title: 'Game Points Administration', message: 'Ocurrió un problema al enviar el correo electrónico, por favor intente mandarlo manualmente a eduardo.oviedo@gmail.com.' });
    };
    res.send({message: 'Gracias por su interez en Game Points, espere y pronto sabrá de nosotros.'});
  });
};