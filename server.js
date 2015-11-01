var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/test');

var cookieParser = require('cookie-parser');
var session = require('express-session');

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(session({secret: 'this is the secret'}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


var bodyParser = require('body-parser');

var AuthenticatedUserSchema = new mongoose.Schema({
	username: String,
	password: String,
	roles: [String]
});
var AuthenticatedUserModel = mongoose.model("AuthenticatedUserModel", AuthenticatedUserSchema);



var AuthenticatedUserHistorySchema = new mongoose.Schema({
	ip: String,
	dateTime: Date,
	action: String,
	username: String
});
var AuthenticatedUserHistory = mongoose.model("AuthenticatedUserHistory", AuthenticatedUserHistorySchema);

// var user = new AuthenticatedUserModel({username: "user", password: "password", roles: ["user"]});
// var manager = new AuthenticatedUserModel({username: "manager", password: "password", roles: ["manager"]});
// var admin = new AuthenticatedUserModel({username: "admin", password: "password", roles: ["admin"]});
// var developer = new AuthenticatedUserModel({username: "developer", password: "password", roles: ["developer"]});
// var tester = new AuthenticatedUserModel({username: "tester", password: "password", roles: ["tester"]});
// user.save();
// manager.save();
// admin.save();
// developer.save();
// tester.save();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // url encoded


passport.use(new LocalStrategy(
	function(username, password, done) {
		AuthenticatedUserModel.findOne({username: username, password: password}, function(err, user) {

			var currentUser = new AuthenticatedUserHistory({
				ip: '127.1.1.0', 
				dateTime: new Date(), 
				action: (user !== null ? 'AUTH_SUCCESS' : 'AUTH_FAILURE'), 
				username: (user !== null ? user.username : currentUseName)
			});
			currentUser.save();

			if(user) {
				return done(null, user);	
			}
			return done(null, false, {message: 'Unable to login'});// null=if any error, false=either false if failed to attempt to login or user object is not valid
		});
}))

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(user, done) {
	done(null, user);
})
var currentUseName = null;
app.post("/login", passport.authenticate('local'), function(req, res) {
	currentUseName = req.user.username;

	res.json(req.user);
});

app.get("/loggedin", function(req, res) {
	res.send(req.isAuthenticated() ? req.user : '0')
});
app.post("/logout", function(req, res) {
	req.logout(); // passport logout
	res.send(200);
});

var auth = function(req, res, next) {
	if(!req.isAuthenticated()) {
		res.send(401);
	}
	else {
		next();
	}	
}

app.get("/rest/user", auth, function(req, res) {
	AuthenticatedUserModel.find(function(err, users) {
		res.json(users);
	});
});

app.post("/register", function(req, res) {
	AuthenticatedUserModel.findOne({username: req.body.username}, function(err, user) {
		if(user) {
			res.json(null);
			return;
		}
		else {
			var newUser = new AuthenticatedUserModel(req.body);
			newUser.roles = ['user'];
			newUser.save(function(err, user) {
				req.login(user, function(err) { // passport login
					if(err) {
						return next(err);
					}
					res.json(user);
				})
			});
		}
	})
	
});

function getUserIP(req) {
	return ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}
app.listen(3000);

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('Ctrl+c to close> ');
rl.prompt();
rl.on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});