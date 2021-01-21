var express = require("express"),
app = express(),
axios = require('axios');
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
cors = require('cors'),
qs = require('qs'),
port = process.env.PORT || 4005;
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/events",{ useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(cors());

// 'newpost' -> query
// 'newcomment' -> query , moderation
// 'updatedcomment' -> query
// 'moderatedcomment' -> comments

var data={
    'newpost':['http://localhost:4002/events'],
    'newcomment':['http://localhost:4002/events','http://localhost:4003/events'],
    'updatedcomment':['http://localhost:4002/events'],
    'moderatedcomment':['http://localhost:4001/events']
};


app.post('/events',function(req,res){
    var event = req.body;
    data[event.type].forEach(async function(x){
        await axios.post(x,qs.stringify(event)).catch(function(err){
            store[event.type].create(event);
        });
    })
    // console.log(event);
    // axios.post('http://localhost:4000/events',qs.stringify(event));
    // axios.post('http://localhost:4001/events',qs.stringify(event));
    // axios.post('http://localhost:4002/events',qs.stringify(event));
    // axios.post('http://localhost:4003/events',qs.stringify(event));
    res.send({});
});

app.listen(port,function(){
    console.log('ok_events');
})