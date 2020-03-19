const { mongoose } = require("../../config/db/mongoose");

var ChatRooms = mongoose.model("ChatRooms", {
  roomId: {
    type: String,
    minlength: 12,
    required: true,
    trim: true
  },
  currentUserEmail: {
    type: Object,
    require: true
  },
  oppUserEmail: {
    type: Object,
    require: true
  },
  currentUserImg: {
    type: Object,
    required: true
  },
  oppUserImg: {
    type: Object,
    required: true
  },
  timestamp: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = { ChatRooms };
