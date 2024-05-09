const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Video = require("../models/videosModel");

const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const createUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: createUser._id, email: createUser.email },
      process.env.JWT_SECRET
    );

    return res
      .status(200)
      .json({ msg: `Welcome 👋 ${username}`, createUser, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, userExist.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ error: "Invalid email/username or password" });
    }

    const username = userExist.username;

    const token = jwt.sign(
      { userId: userExist._id, email: userExist.email },
      process.env.JWT_SECRET
    );

    res
      .status(200)
      .json({ msg: `Welcome back 👋 ${username}`, userExist, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const Videos = async (req, res) => {
  const videos = await Video.find().populate("creator");
  res.json(videos);
};

const LatestVideos = async (req, res) => {
  try {
    const latestVideos = await Video.find().sort({ createdAt: -1 }).limit(7);

    if (latestVideos.length === 0) {
      return res.status(404).json({ error: "No videos found" });
    }

    return res.status(200).json({ latestVideos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const SearchPosts = async (req, res) => {
  try {
    const { query } = req.params;

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Split the query into separate keywords
    const keywords = query.split(" ").filter(Boolean); // filter(Boolean) removes any empty strings

    // Find posts that contain all of the specified keywords in the title
    const posts = await Video.find({
      title: { $all: keywords.map((keyword) => new RegExp(keyword, "i")) },
    });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(error);
  }
};

const GetUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const posts = await Video.find({ creator: userId });

    if (!posts) {
      return res.json({ msg: "No posts found by this user" });
    }
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(error);
  }
};

const CreateVideos = async (req, res) => {
  try {
    const { title, thumbnail, video, prompt, creator } = req.body;

    if (!title || !thumbnail || !video || !prompt || !creator) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newVideo = await Video.create({
      title,
      thumbnail,
      video,
      prompt,
      creator,
    });

    return res
      .status(201)
      .json({ message: "Video created successfully", newVideo });
  } catch (error) {
    console.error("Error creating video:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  Register,
  Login,
  Videos,
  LatestVideos,
  SearchPosts,
  GetUserPosts,
  CreateVideos,
};
