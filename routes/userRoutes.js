const express = require("express");
const userController = require("../controllers/userControllers");
const router = express.Router();

router.route("/register").post(userController.Register);
router.route("/login").post(userController.Login);
router.route("/videos").get(userController.Videos);
router.route("/latestvideos").get(userController.LatestVideos);
router.route("/search/:query").get(userController.SearchPosts);
router.route("/userposts/:userId").get(userController.GetUserPosts);
router.route("/createvideo").post(userController.CreateVideos);

module.exports = router;
