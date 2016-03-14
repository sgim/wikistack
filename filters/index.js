module.exports = function (swig) {
	var pageLink = function (page) {
		return '<li><a href="' + page.route + '">' + page.title + '</a>'+
			        '<li>' + page.tags.join(" ") +  '</li></li>';
	};

	pageLink.safe = true;
  swig.setFilter("pageLink", pageLink);
};