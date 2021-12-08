const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRouter = require("./routes/auth.route");
const User = require("./models/auth.model");
const connectDB = require("./config/db");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    withCredentials: true,
  })
);

connectDB();
app.use(bodyParser.json());
// app.use(express.json());

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

app.use("/api", authRouter);
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
