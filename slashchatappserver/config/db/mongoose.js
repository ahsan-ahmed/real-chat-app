/////mongoose is now configured
//$heroku git:remote -a todonodeapp01

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://ahsan:admin1@ds113375.mlab.com:13375/todo-app", {
  useNewUrlParser: true
});

module.exports = { mongoose };
