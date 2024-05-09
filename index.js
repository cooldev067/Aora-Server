const express = require("express");
const router = require("./routes/userRoutes");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();

const app = express();

app.use(express.json());
app.use("/", router);

connectDB();

const PORT = process.env.PORT || 3000; // Set the port
app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});
