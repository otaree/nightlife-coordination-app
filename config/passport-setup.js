var passport = require('passport');
var GithubStrategy = require('passport-github');
var TwitterStrategy = require('passport-twitter');
var keys = require('./keys');
var User = require('../models/users');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(
    new TwitterStrategy({
        consumerKey: keys.twitter.consumerKey,
        consumerSecret: keys.twitter.consumerSecret,
        callbackURL: keys.twitter.callback
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
			console.log(profile.id);
			User.findOne({'twitter.id': profile.id}, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();
					newUser.twitter.id = profile.id;
					newUser.save(function(err) {
						if (err) {
							throw err;
						}
						console.log("new User", newUser);
						return done(null, newUser);
					});
				}
			});
		});
    })
);