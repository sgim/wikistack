var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/wikistack");
var db = mongoose.connection;
var marked = require("marked");
var Schema = mongoose.Schema;
db.on("error", console.error.bind(console, "mongodb connection error:"));

var user = new Schema({
	name: {type: String, required: true},
	email: {type: String, unique: true, required: true}
});
user.virtual("link").get(function() {
  return "/wiki/users/" + this._id;
});
var User = db.model("User", user);

var page = new Schema({
	title: {type: String, required: true},
	urlTitle: {type: String, required: true},
	content: {type: String, required: true},
	date: {type: Date, default: Date.now},
	status: {type: String, enum: ['open', 'closed']},
	author: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	tags: [String]
});
page.virtual("route").get(function () {
	return "/wiki/" + this.urlTitle;
});
page.virtual("renderedContent").get(function () {
  return marked(this.content);
});
page.pre("save", function (next) {
	var that = this;
  this.urlTitle = this.urlTitle.replace(/[^\w ]/g, "").replace(/ /g, "_") ||
	                  Math.random().toString(36).substring(2, 7);
  Page.findOne({urlTitle: this.urlTitle})
	.then(function (existingPage) {
	  if(existingPage) {
      that.urlTitle += "_" + Math.random().toString(36).substring(2,5);
		}
		next();
	});
});
var Page = db.model("Page", page);

module.exports = {
	Page: Page,
	User: User
};




