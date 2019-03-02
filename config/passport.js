const JwtStrategy = require('passport-jwt').Strategy; 
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose'); 
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {}; 
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBrearerToken();
opts.secret = keys.secret; 

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload);
    }))
}
