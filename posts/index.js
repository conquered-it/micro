var axios = require("axios");
var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
cors = require('cors'),
qs = require('qs'),
port = process.env.PORT || 4000;
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/posts",{ useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(cors()); 
var postsSchema = new mongoose.Schema({
	title:String,
	body:String
});

var posts = mongoose.model("posts",postsSchema);

app.get('/',function(req,res){
	res.redirect('/posts');
})

app.get('/posts',function(req,res){
	posts.find({},function(err,posts){
		if(err) console.log('err');
		else res.send(posts);
	})
})

app.post('/posts',function(req,res){
	posts.create(req.body._doc.post,async function(err,ret){
		if(err) console.log('err');
		else{
			axios.post('http://localhost:4005/events',
			qs.stringify({
				type: 'newpost',
				title: ret.title,
				body: ret.body,
				id: ret._id.toString()
			}));
			res.redirect('http://localhost:3000/');
		}
	});
});

app.post('/events',function(req,res){
	res.send({});
});

app.listen(port,async function(){
	console.log('ok');
	try{
		await axios.post('http://localhost:4005/check',qs.stringify({type:'createpost'}));
	}catch{}
})