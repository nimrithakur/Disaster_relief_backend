const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' })

module.exports = function configurePassport(){
  // Google
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
      try{
        const email = profile.emails && profile.emails[0] && profile.emails[0].value
        let user = null
        if (email) user = await User.findOne({ email })
        if (!user) {
          user = await User.create({ name: profile.displayName || email || 'Google User', email: email || `no-email-${profile.id}@example.com`, password: Math.random().toString(36).slice(-8) })
        }
        const token = generateToken(user._id)
        return done(null, { token, user })
      }catch(err){
        return done(err)
      }
    }))
  }

  // Facebook
  if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails']
    }, async (accessToken, refreshToken, profile, done) => {
      try{
        const email = profile.emails && profile.emails[0] && profile.emails[0].value
        let user = null
        if (email) user = await User.findOne({ email })
        if (!user) {
          user = await User.create({ name: profile.displayName || email || 'FB User', email: email || `no-email-${profile.id}@example.com`, password: Math.random().toString(36).slice(-8) })
        }
        const token = generateToken(user._id)
        return done(null, { token, user })
      }catch(err){
        return done(err)
      }
    }))
  }

}
