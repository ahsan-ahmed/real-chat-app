// server.js
require("dotenv").config({ path: "variables.env" });

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const webPush = require("web-push");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { origins: "*:*" });

const { mongoose } = require("./config/db/mongoose");
const { cloudinary } = require("./config/cloudinaryConfig/cloudinaryConfig");
const { UserAuth } = require("./models/todoUsers/todoUsers");
const { ChatRooms } = require("./models/ChatRooms/ChatRooms");
const { Messages } = require("./models/Messages/Messages");
const { UserGroupRoom } = require("./models/UserGroupRoom/UserGroupRoom");

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const webPushContact = process.env.WEB_PUSH_CONTACT;
const db = mongoose.connection;
const port = process.env.PORT || 4000;
// console.log(publicVapidKey, privateVapidKey, webPushContact, "--->");
//////configure Webpush notification///////
webPush.setVapidDetails(webPushContact, publicVapidKey, privateVapidKey);
//////

let Roome;
io.sockets.on("connection", socket => {
  socket.on("joinRoom", room => {
    socket.join(room);
    Roome = room;
    console.log("user joined room " + room);
  });

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("createMessage", msg => {
    io.to(Roome).emit("newMessage", {
      from: msg.from,
      text: msg.message
    });
    //socket.broadcast(roome).emit('chat message',msg);;
  });

  socket.on("newGroupCreated", msg => {
    io.emit("newGroupCreatedMessage", { msg });
  });
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("db connected!");
});

app.use(cors());
app.use(bodyParser.json({ limit: "10mb", extended: true }));

// app.use(express.static(path.join(__dirname, "../build")));

// //production mode
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../build")));
//   app.get("/", (req, res) => {
//     res.sendfile(path.join((__dirname = "../build/index.html")));
//   });
// }
// //build mode
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname + "../public/index.html"));
// });

app.get("/chatusers", function(req, res) {
  UserAuth.find({})
    .then(users => {
      const userMap = [];
      users.forEach(user => {
        userMap.push(user);
      });
      res.send(userMap);
    })
    .catch(e => {
      res.send(e);
    });
});

//////////////////WebPush///////////////////
app.post("/notifications/subscribe", (req, res) => {
  const { subscription, payload } = req.body;
  // console.log(subscription, payload, "payload");
  webPush
    .sendNotification(subscription, JSON.stringify(payload))
    .then(result => {
      res.status(200).json({ success: true });
      console.log(result);
    })
    .catch(e => console.log(e.stack));
});

///////////////////////////////////

///////save token to database/////////
app.post("/saveTokenOnDatabase", (req, res) => {
  const {
    loginUser: {
      isLoginUser: { _id }
    },
    subscription
  } = req.body;

  UserAuth.findByIdAndUpdate(
    _id,
    { $set: { token: subscription } },
    { new: true },
    function(err, model) {
      if (err) {
        res.status(400).json(err);
        console.log("Something wrong when updating data!");
      }
      if (model) {
        res.status(200).json(model);
      }
    }
  );
});

///////////////////////////////////////

//////////Get User Token///////////////
app.get("/getUserToken/:OppUser", function(req, res) {
  let { OppUser: OppUserEmail } = req.params;
  UserAuth.find({ email: OppUserEmail })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.log(error, "error");
      res.status(400).json(error);
    });
});
/////////////////////////////////////////

app.get("/rooms", function(req, res) {
  ChatRooms.find({})
    .then(rooms => {
      const roomMap = [];
      rooms.forEach(room => {
        roomMap.push(room);
      });
      res.send(roomMap);
    })
    .catch(e => {
      res.send(e);
    });
});

app.post("/rooms", (req, res) => {
  const {
    roomId,
    currentUserEmail,
    oppUserEmail,
    currentUserImg,
    oppUserImg,
    timestamp
  } = req.body.userRoom;
  var chatRooms = new ChatRooms({
    roomId,
    currentUserEmail,
    oppUserEmail,
    currentUserImg,
    oppUserImg,
    timestamp
  });
  chatRooms.save().then(
    docs => {
      res.send(docs);
    },
    err => {
      res.send(err);
    }
  );
});

app.get("/groupRooms", function(req, res) {
  UserGroupRoom.find({})
    .then(rooms => {
      const groupRoomMap = [];
      rooms.forEach(room => {
        groupRoomMap.push(room);
      });
      res.send(groupRoomMap);
    })
    .catch(e => {
      res.send(e);
    });
});

app.post("/groupRooms", (req, res) => {
  var userGroupRoom = new UserGroupRoom({
    roomId: req.body.userGroupRoom.roomId,
    groupName: req.body.userGroupRoom.groupName,
    group: req.body.userGroupRoom.group,
    userGroup: req.body.userGroupRoom.userGroup,
    timestamp: req.body.userGroupRoom.timestamp
  });
  userGroupRoom.save().then(
    docs => {
      res.send(docs);
    },
    err => {
      res.send(err);
    }
  );
});

app.get("/messages/:roomId", function(req, res) {
  Messages.find({ roomId: req.params.roomId })
    .then(messages => {
      res.send(messages);
    })
    .catch(e => {
      res.send(e);
    });
});

app.post("/messages/:roomId", (req, res) => {
  const { message, from } = req.body.messagesList;
  Messages.findOneAndUpdate(
    { roomId: req.params.roomId },
    {
      $push: {
        messagesList: {
          message,
          from
        }
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
    (err, doc) => {
      if (err) {
        res.status(400).json({ err });
        console.log("Something wrong when updating data!");
      }
      if (doc) {
        res.status(200).json({ from, message });
      }
    }
  );
});

app.get("/login/:email", (req, res) => {
  var email = req.params.email;
  UserAuth.find({ email: email })
    .then(doc => {
      res.send(...doc);
    })
    .catch(e => {
      res.send(e);
    });
});

app.get("/signup/:email", (req, res) => {
  var email = req.params.email;
  UserAuth.find({ email: email })
    .then(doc => {
      res.send(doc);
    })
    .catch(e => {
      res.send(e, "error");
    });
});

app.post("/signup", (req, res) => {
  // SEND FILE TO CLOUDINARY
  console.log("file uploaded to server");
  const path = req.body.img;
  const uniqueFilename = new Date().toISOString();
  const timestamp = new Date().toLocaleString();

  cloudinary.uploader
    .upload(path, {
      public_id: `slashchatUserImg/${uniqueFilename}`,
      tags: `blog`
    })
    .then(image => {
      console.log("file uploaded to Cloudinary");
      let userAuth = new UserAuth({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        img: image.secure_url,
        timestamp: timestamp
      });
      userAuth.save().then(
        docs => {
          res.send(docs);
        },
        err => {
          res.send(err);
          res.status(400).send();
        }
      );
    })
    .catch(err => {
      res.send(err);
    });
});
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
