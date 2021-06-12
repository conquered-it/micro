var express = require("express"),
axios = require("axios"),app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),cors = require('cors'),
qs = require('qs'),port = process.env.PORT || 4001;
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/comments",{ useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(cors()); 
var commentsSchema = new mongoose.Schema({
	body:String,
	postid:String,
});

var comments = mongoose.model("comments",commentsSchema);


app.get('/posts/comments',function(req,res){
	comments.find({},function(err,comm){
		if(err) console.log('err');
		else res.send(comm);
	})
})


app.get('/posts/:id/comments',function(req,res){
	comments.find({postid:req.params.id},function(err,comm){
		if(err) console.log('err');
		else res.send(comm);
	})
})

app.post('/comments',function(req,res){
	var temp=req.body.comment;
	if(!temp) temp=req.body._doc.comment;
	comments.create(temp,async function(err,ret){
		if(err) console.log('err');
		else{
			axios.post('http://localhost:4005/events',
			qs.stringify({
				type: 'newcomment',
				id: ret._id.toString(),
				body: ret.body,
				postid: ret.postid,
			})).catch(function(err){
				console.log('errorfound');
			});
			res.redirect('http://localhost:3000/');
		}
	});
});

app.post('/events',async function(req,res){
	res.send({});
});

app.listen(port,async function(){
	console.log('ok');
	try{
		await axios.post('http://localhost:4005/check',qs.stringify({type:'createcomment'}));
	}catch{}
})
