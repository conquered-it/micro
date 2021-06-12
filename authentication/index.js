var axios = require("axios");
var express = require("express"),
app = express(),
json = require("body-parser"),
mongoose = require("mongoose"),
cors = require('cors'),
passport = require("passport"),
passportLocal = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
qs = require('qs'),
cookieSession = require('cookie-session'),
jwt = require('jsonwebtoken'),
port = process.env.PORT || 3010;
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/posts",{ useUnifiedTopology: true });
app.set("view engine","ejs");
app.set('trust proxy',true);
app.use(express.static(__dirname + '/public'))
app.use(express.static('views'));
app.use(cors()); 
app.use(json());
app.use(
    cookieSession({
        signed:false,
        secure:true
    })
);
app.use(require("express-session")({
	secret: "LOL",
	resave: false,
	saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

var UserSchema = new mongoose.Schema({
	username:String,
    password:String,
});

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', UserSchema);


passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})

app.get('/',IsLoggedIn,function(req,res){
    console.log(req.user);
    res.send("ok");
})

app.get('/authenticate',function(req,res){
    console.log(req.user);
    if(req.isAuthenticated()) res.send(true);
    else res.send(false);
})

app.get('/register',function(req,res){
    res.render("register");
})

app.post('/register',function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err) res.render(register);
        passport.authenticate("local")(req,res,function(){
			var userJwt = jwt.sign({
                username: user.username
            },"LOL");
            console.log(userJwt);
            req.session={
                jwt:userJwt
            };
            res.redirect('/');
            console.log(req.session);
		})
    })
})


app.get('/login',function(req,res){
    console.log(req.session);
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login"
}),function(req,res){});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/login");
})

function IsLoggedIn(req,res,next){
	if(req.isAuthenticated()) return next();
	else res.redirect("/login");
}


app.listen(port,function(){
    console.log('AuthServiceStarted');
})