const { mongoose } = require("../../config/db/mongoose");

var UserAuth = mongoose.model("UserAuth", {
  username: {
    type: String,
    minlength: 1,
    required: true,
    trim: true
  },
  email: {
    type: String,
    minlength: 9,
    lowercase: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6,
    require: true,
    trim: true
  },
  token: {
    type: Object
  },
  img: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    require: true
  }
});

module.exports = { UserAuth };
