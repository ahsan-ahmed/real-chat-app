const { mongoose } = require("../../config/db/mongoose");

var UserGroupRoom = mongoose.model("UserGroupRoom", {
  roomId: {
    type: String,
    minlength: 12,
    required: true,
    trim: true
  },
  group: {
    type: Boolean,
    require: true
  },
  groupName: {
    type: String,
    minlength: 1,
    required: true,
    trim: true
  },
  userGroup: {
    type: Array,
    require: true
  },
  timestamp: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = { UserGroupRoom };
