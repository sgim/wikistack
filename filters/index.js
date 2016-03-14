module.exports = function (swig) {
	var pageLink = function (page) {
		return '<li><a href="' + page.route + '">' + page.title + '</a>'+
			        '<li>' + page.tags.join(" ") +  '</li></li>';
	};

	pageLink.safe = true;

	var userUrl = function (user) {
		return "/wiki/users/" + user._id;
	};
	userUrl.safe = true;
	
	var userLink = function (user) {
		console.log(user);
		return '<li><a href="' + userUrl(user) + '">' + user.name + '</a></li>';
	};
	userLink.safe = true;
  swig.setFilter("pageLink", pageLink);
	swig.setFilter("userUrl", userUrl);
	swig.setFilter("userLink", userLink);
};