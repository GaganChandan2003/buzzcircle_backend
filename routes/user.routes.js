const express = require("express");
const UserModel = require("../models/User.model");
const bcrypt = require("bcrypt");
const userController = express.Router();
require("dotenv").config();
let jwt = require("jsonwebtoken");
const ProfileModel = require("../models/Image.model");
const fs = require("fs");
const authentication = require("../middleware/authentication");
const profileUpload=require("../middleware/profileUpload")



userController.post("/register", async (req, res) => {
  const { username, email, password, phone_number } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    bcrypt.hash(password, 6, async (err, hash) => {
      if (err) {
        return res.send("Please try again");
      }
      const user = new UserModel({
        username,
        email,
        password: hash,
        phone_number,
      });
      try {
        await user.save();
        res.send({ messege: "Signedup sucessfully" }).status(200);
      } catch {
        res.status(404);
      }
    });
  } else {
    res.status(404).send({ messege: "User already exists" });
  }
});

userController.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.send("Invalid Credentials").status(404);
  }
  const hash = user.password;
  const userId = user._id;
  bcrypt.compare(password, hash, function (err, result) {
    if (result) {
      var token = jwt.sign({ email, userId }, process.env.SECRET);
      res.status(200).send({
        messege: "Login Sucessfull",
        token: token,
        username: user.username,
        result: result,
      });
    } else {
      return res.status(400).send({messege:"Invalid Credentials"});
    }
  });
});

userController.post(
  "/profile",
  profileUpload.single("profile"),
  authentication,
  async (req, res) => {
    const { email } = req.body;
    const profile = await ProfileModel.findOne({ email });
    if (!profile) {
      const profileImage = new ProfileModel({
        email,
        profile: {
          data: fs.readFileSync("profiles/" + req.file.filename),
          contentType: "image/png",
        },
      });
      try {
        profileImage.save();
        res.send({ messege: "New profile picture added" }).status(200);
      } catch {
        res.send({ messege: "Error while adding profile picture" }).status(400);
      }
    } else {
      res.send({ messege: "Profile already exists" }).status(400);
    }
  }
);

userController.get("/profile", authentication, async (req, res) => {
  const { email } = req.body;
  try {
    const profile = await ProfileModel.findOne({ email });
    res.send({ messege: "Profile Picture", data: profile }).status(200);
  } catch {
    res.send({ messege: "Couldnt find the profile" }).status(404);
  }
});

module.exports = userController;
