var admin = {
	initialize: function(){
		console.log('Application initialized');
		$('a#signup').click(admin.gotoSignup);
		$('a.brand, a.home').click(admin.gotoHome);
	},
	gotoHome: function(){
		$('article.container.active').toggle('slide', 500, function(){
			$('article#home').toggle('slide', 500);
			$('article.container.active').removeClass('active');
			$('article#home').addClass('active');
		});
	},
	gotoSignup: function(){
		$('article.container.active').toggle('slide', 500, function(){
			$('article#signupContainer').toggle('slide', 500);
			$('article.container.active').removeClass('active');
			$('article#signupContainer').addClass('active');
		});
	}
};