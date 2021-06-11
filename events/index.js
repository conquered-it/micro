var express = require("express"),
app = express(),
axios = require('axios');
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
cors = require('cors'),
qs = require('qs'),
port = process.env.PORT || 4005;
mongoose.set('useNewUrlParser', true);
var MongoClient = require('mongodb').MongoClient;
mongoose.connect("mongodb://localhost/events",{ useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(cors());

// 'newpost' -> query
// 'newcomment' -> query , moderation
// 'updatedcomment' -> query
// 'moderatedcomment' -> comments

var createpostSchema = new mongoose.Schema({
    post:{
        title:String,
        body:String
    }
});

var createpost = mongoose.model("createpost",createpostSchema);

var data={
    'newpost':['http://localhost:4002/events'],
    'newcomment':['http://localhost:4002/events'],
    'createpost':['http://localhost:4000/posts']
};

var store={
    'createpost':createpost
}

var update={
    'createpost':'http://localhost:4000/posts',
}

app.post('/events',function(req,res){
    var event = req.body;
    data[event.type].forEach(async function(x){
        try{
            await axios.post(x,qs.stringify(event))
        }catch{
            console.log("This service is currently not available, your changes will be soon updated");
            store[event.type].create({post:event.post},function(err,ret){
                if(err) console.log('err');
            });
        };
    })
    res.redirect('http://localhost:3000');
});

app.post('/check',async function(req,res){
    var event = req.body;
    store[event.type].find({},async function(err,ret){
        ret.forEach(async function(x){
            await axios.post(update[event.type],qs.stringify(x));
        })
        func(store[event.type]);
    })
    function func(val){
        val.remove({},function(err){
            if(err) console.log('err');
        });
    }
})

app.listen(port,function(){
    console.log('ok_events');
})