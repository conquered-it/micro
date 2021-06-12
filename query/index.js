var express = require("express"),
app = express(),
axios = require('axios');
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
cors = require('cors'),
qs = require('qs'),
port = process.env.PORT || 4002;
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/query",{ useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(cors()); 

var postsSchema = new mongoose.Schema({
    id:String,
    title:String,
    body:String,
    comments:[
        {
            id:String,
            body:String
        }
    ]
});

var posts = mongoose.model("posts",postsSchema);

app.get('/posts',async function(req,res){
    posts.find({},function(err,ret){
        if(err) console.log('err');
        else res.send(ret);
    })
})

app.post('/events',function(req,res){
    var temp = req.body;
    if(temp.type === 'newpost'){
        var id = temp.id, title = temp.title ,
        body = temp.body , comments = [];
        posts.create({id:id,title:title,body:body,comments:comments},
        function(err,ret){
            if(err) console.log('err');
        });
    }
    if(temp.type === 'newcomment'){
        var postid = temp.postid , id = temp.id , 
        body = temp.body;
        posts.findOne({id:postid},function(err,ret){
            ret.comments.push({id:id,body:body});
            ret.save();

        })
    }
    res.send({});
});

app.listen(port,function(){
    console.log('ok');
})