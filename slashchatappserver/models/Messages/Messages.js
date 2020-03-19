const { mongoose } = require("../../config/db/mongoose");

var Messages = mongoose.model("Messages", {
  roomId: {
    type: String,
    minlength: 12,
    require: true,
    trim: true
  },
  messagesList: [
    {
      message: {
        type: String,
        minlength: 1,
        required: true,
        trim: true
      },
      from: {
        type: String,
        minlength: 1,
        required: true,
        trim: true
      }
    }
  ]
});

module.exports = { Messages };
