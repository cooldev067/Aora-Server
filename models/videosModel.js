const { model, Schema } = require("mongoose");

const videoSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Video = model("Video", videoSchema);

module.exports = Video;
