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
    	if (response.id === undefined) {
    		// logout
    	}else{
        $.ajax({
          type: "POST",
          url: '/admin/login',
          data: {'user':{'method': 'facebook','facebookid': response.id,'name': response.name}},
          dataType: 'json'
        });
    	};
      console.log(response);
    });
	}
};

adminApp.initialize();