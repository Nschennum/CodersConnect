const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const favicon = require("serve-favicon")

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DB Config
const db = require("./config/keys").mongoURI;

// mongoose.models = {};
// mongoose.modelSchemas = {};
// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

app.use(favicon(path.join(__dirname, "client", "public", "favicon.ico")));

//passport config
require("./config/passport")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // set static folder to frontend html
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
