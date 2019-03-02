const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const users = require('./routes/api/users'); 
const profile = require('./routes/api/profile');
const posts = require('./routes/api/users');

const app = express(); 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  //passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport); 

// Use Routes
app.use('/api/users', users); 
app.use('/api/profile', profile); 
app.use('/api/posts', posts); 

const port = process.env.PORT || 5000; 

app.listen(port, () => console.log(`Server running on port ${port}`)); 