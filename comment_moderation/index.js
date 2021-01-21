var express = require("express"),
axios = require("axios"),app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),cors = require('cors'),
qs = require('qs'),port = process.env.PORT || 4003;
mongoose.set('useNewUrlParser', true);
mongoose.connect("mongodb://localhost/comments",{ useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(cors());

app.post('/events',async function(req,res){
    var temp = req.body;
    if(temp.type === 'newcomment'){
        temp.status='approved';
        temp.type='moderatedcomment';
        if(temp.body.includes('retard')) temp.status='rejected';
        await axios.post('http://localhost:4005/events',
            qs.stringify(temp)).catch(function(err){
                console.log('err',err);
            });
    }
    res.send({});
})

app.listen(port,function(){
	console.log('ok');
})