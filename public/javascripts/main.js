var adminApp = {
	initialize: function(){
		console.log('Welcome to Game Points');
		FB.init({ appId:'160105650823665' });
		FB.getLoginStatus(adminApp.handleSessionResponse);
		$(document).ready(adminApp.bindEvents);
	},

	bindEvents: function(){
		$('a.fb').bind('click', function() {
       FB.login(adminApp.handleSessionResponse);
    });

    $('a.fblogout').bind('click', function() {
      FB.logout(adminApp.handleSessionResponse);
    });
	},

	handleSessionResponse: function() {
    FB.api('/me', function(response) {
      console.log(response);
      $('#user-info').html(response.id + ' - ' + response.name);
    });
	}
};

adminApp.initialize();