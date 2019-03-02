//login/passport
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys');

const User = require("../../models/User");

router.get("/test", (req, res) => res.json({ msg: "Users works!" }));

// req.body.email must match form input
// with mongoose you can use callbacks or promises
//.then is using promises
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: "r", //Rating
        d: "mm" //Defaut Img
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// User Login /Returns JWT
router.post('/login', (req, res) => {
  const email = req.body.email; 
  const password = req.body.password;

  //Find User email
  User.findOne({email})
  .then(user => {
    //check for user
    if(!user) {
      return res.status(404).json({email: 'User not found'})
    }

    //Check password
    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if(isMatch) {
        //User Matched

        const payload = { id: user.id, name: user.name, avatar: user.avatar } // payload
        //Sign Token
        jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true, 
            token: 'Bearer ' + token
          })
        });
      } else {
        return res.status(400).json({password: 'Incorrect Password'})
      }
    })
  })
})


module.exports = router;
