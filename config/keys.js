module.exports = {
    github: {
        clientID: process.env.GITHUB_KEY,
        clientSecret: process.env.GITHUB_SECRET,
        callback:  process.env.APP_URL + 'auth/github/callback'
    },
    twitter: {
        consumerKey: process.env.TWITTER_KEY,
        consumerSecret: process.env.TWITTER_SECRET,
        callback:  process.env.APP_URL + 'auth/twitter/callback'
    },
    mongodb: {
        dbURI: process.env.MONGO_URI
    },
    session: {
        cookieKey: process.env.COOKIE_KEY
    },
    yelp: {
        cleintKey: process.env.YELPKEY
    }
}