const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "ahsanahmed",
  api_key: "582216477347271",
  api_secret: "spyVEmXE61FsUosORO0DgyNWaXY"
});

module.exports = { cloudinary };
