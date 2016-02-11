module.exports = {
  "DATABASE_URI": process.env.MONGOLAB_URI,
  "SESSION_SECRET": process.env.SESSION_SECRET,
  "GOOGLE": {
    "clientID": process.env.GOOGLE_CLIENT_ID,
    "clientSecret": process.env.GOOGLE_CLIENT_SECRET,
    "callbackURL": process.env.CALLBACK_URL
  }
};