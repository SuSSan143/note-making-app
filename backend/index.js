require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const { authRoutes } = require("./routes/auth");
const { notesRoute } = require("./routes/notes");

const whitelist = [
  "http://127.0.0.1:5173",
  "https://note-making-app-frontend-v6pj.vercel.app",
];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(
  session({
    secret: "note-taking-app",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://admin:${process.env.MONGODB_ADMIN_PASSWORD}@cluster0.0v9bi.mongodb.net/note-taking-app?retryWrites=true&w=majority`,
      autoRemove: "interval",
      collectionName: "sessions",
    }),
  })
);

app.use(authRoutes);
app.use(notesRoute);

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.MONGODB_ADMIN_PASSWORD}@cluster0.0v9bi.mongodb.net/note-taking-app?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  });

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected to server successfully");
});

console.log("Waiting for server to connect...");

module.exports = app;
