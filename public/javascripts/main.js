(function(){

  var initialize = function(){
    bindevents();    
    populatedates();
    activatevalidations();
  };

  var bindevents = function(){
    $('nav div.login').click(activatelogin);
    $('nav div.signin').click(activatesignin);
  };

  var activatelogin = function(){
    $this = $(this);
    $this.toggleClass('active');
    $('nav section.logincontent').toggle('slow');
  };

  var activatesignin = function(){
    var $this = $(this);
    $this.toggleClass('active');
    $('nav section.signincontent').toggle('slow', function(){
      var $overlay = $('div.overlay');
      if ($overlay.length) {
        $overlay.remove();
      } else{
        var $outer = $('body');
        $overlay = $('<div >', {
          class: 'overlay',
          css: {
            height: $outer.outerHeight()
          }
        }).appendTo($outer);
        $('html, body').animate({
          scrollTop: $('nav section.signincontent header').offset().top
        }, 'slow');
      };
    });
  };

  var activatevalidations = function(){
    $.validator.addMethod("valueNotEquals", function(value, element, arg){
      return arg != value;
    }, "Value must not equal arg.");
    $('form.signin').validate({
      rules: {
        name: 'required',
        email: 'required',
        gender: {
          valueNotEquals: 'Seleccionar'
        },
        year: {
          valueNotEquals: 'Año'
        },
        month: {
          valueNotEquals: 'Mes'
        },
        day: {
          valueNotEquals: 'Día'
        },
        password: 'required',
        password_confirm: {
          required: true,
          equalTo : "#password"
        }
      },
      messages: {
        name: 'El nombre es requerido.',
        email: 'El email es requerido.',
        gender: 'El género es requerido.',
        year: 'El año es requerido.',
        month: 'El mes es requerido.',
        day: 'El día es requerido.',
        password: 'La contraseña es requerida.',
        password_confirm: 'La confirmación es requerida.'
      },
      errorPlacement: function(error, element) {
        error.addClass(error);
        error.insertAfter(element);
      }
    });
  };

  var populatedates = function(){
    var $year = $('select.year');
    var $month = $('select.month');
    var $day = $('select.day');
    var today = new Date();
    var o = {};
    for (var i = 0; i < 100; i++) {
      o = new Option(today.getFullYear() - i, today.getFullYear() - i);
      $(o).html(today.getFullYear() - i);
      $year.append(o);
    };

    for (var i = 1; i <= 12; i++) {
      o = new Option(i.toString().length > 1? i : '0'+i, i);
      $(o).html(i.toString().length > 1? i : '0'+i);
      $month.append(o);
    };

    var populatedays = function(month, year){
      var daysinmonth = function(month, year){
        return !(isNaN(month) || isNaN(year)) ? new Date(year, month, 0).getDate() : 31;
      };
      $day.children('option:not(:first)').remove();
      var days = daysinmonth(month, year);
      for (var i = 1; i <= days; i++) {
        o = new Option(i.toString().length > 1? i : '0'+i, i);
        $(o).html(i.toString().length > 1? i : '0'+i);
        $day.append(o);
      };
    };

    populatedays(today.getMonth() + 1, today.getFullYear());

    $('select.year, select.month').change(function(){
      populatedays($month.val(), $year.val());      
    });
  };

  initialize();
})();