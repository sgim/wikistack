var express = require("express");
var router = express.Router();
var models = require("../models");
var User = models.User, Page = models.Page;

router.get("/", function (req, res) {

  Page.find().then(function(pages) {
	  res.render("index", {pages: pages, header: "Wikistack"});
	}, function(err) {
	  res.render("error", err);
	});

});

router.get("/result", function (req, res) {
	//res.json(req.query.tags);
  var tags = req.query.tags.split(" ");
	var exclude = req.query.exclude;
  Page.find({
		tags: { $in: tags},
		_id: {$ne: exclude}
	})
	.then(function (pages) {
    res.render("index", {pages: pages, header: "Results"});
	}, function (err) {
		res.render("error", err);
	});

});


router.post("/", function (req, res) {
  //res.json(req.body);
	var obj = req.body;
	User.findOne({email: obj.email})
	.then(function (user) {
    var author = user || new User({
			name: obj.author,
			email: obj.email
		});
		author.save();
		new Page({
			title: obj.title,
			urlTitle: obj.title,
			content: obj.content,
			date: Date.now(),
			status: obj.status,
			author: author._id,
			tags: obj.tags.split(" ")
		})
		.save()
		.then(function (p) {
			res.redirect(p.route);
		}, function (err) {
			console.error(err)
			res.render("error", err);
		});
	});
  
});

router.get("/:title", function (req, res) {
  var title = req.params.title;
	if(title === "add") {
		res.render("addPage");
	} else if (title === "search") {
	  res.render("search");
	} else if (title === "users") {
		User.find()
	  .then(function (users) {
      res.render("users", {header: "Users", users: users});
		});
	}	else if (title) {
		Page.findOne({urlTitle: title})
		.populate("author")
		.then(function (page) {
			res.render("wikipage", page);
		}, function (err) {
			res.render("error", err);
		});
	}
});

router.get("/:title/edit", function (req, res) {
  var title = req.params.title;
	Page.findOne({urlTitle: title})
	.populate("author")
	.then(function (page) {
		res.render("editwiki", page);
	}, function (err) {
		res.render("error", err);
	});
});
router.get("/:title/delete", function (req, res) {
  var title = req.params.title;
	Page.findOne({urlTitle: title})
	.remove()
	.exec(function (err) {
		if (err) {
			res.render("error", err);
		} else {
			res.redirect("/");
		}
	});
});
router.post("/:title/update", function (req, res) {
  var title = req.params.title;
	var updatedPost = req.body;
	Page.update({urlTitle:title}, {$set: updatedPost})
	.then(function(page) {
    res.redirect("/wiki/" + title);
	});
});

router.get("/:title/similar", function (req, res) {
  var title = req.params.title;
	Page.findOne({urlTitle: title})
	.then(function(page) {
		res.redirect("/wiki/result" + '?tags=' + page.tags.join('+') +"&exclude="+page._id);
	});
});

router.get("/users/:id", function (req, res) {
  var id = req.params.id;
	Page.find({author: id})
	.populate("author")
	.then(function(pages) {
		console.log(pages);
		if (pages.length) {
		  res.render("index",{pages : pages, header : pages[0].author.name + "'s page"});
		} else {
      User.findOne({_id: id})
		  .then(function (user) {
				res.render("index", {pages: [], header: user.name + "'s page"});
      });
		}
	});

});

router.get("/add", function (req, res) {
  //res.render("addPage");
});


module.exports = router;