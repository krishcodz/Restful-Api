const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });
mongoose.set('strictQuery', true);

const articleschema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Article", articleschema);

app.route("/articles")
    .get(function(req,res) {
        Article.find({}, function(err,founditems){
            if(!err){
                res.send(founditems);
            }
            else{
                res.send(err);
            }
        })
    })
    .post(function(req, res){

        const newArticle = new Article({
          title: req.body.title,
          content: req.body.content
        });
      
        newArticle.save(function(err){
          if (!err){
            res.send("Successfully added a new article.");
          } else {
            res.send(err);
          }
        });
      })
    .delete(function(req,res){
        Article.deleteMany({}, function(err){
            if(!err){
                res.send("successfully deleted");
            }
            else{
                res.send(err);
            }
        })
    });



app.route("/articles/:title")
    .get(function(req,res){
        Article.findOne({title: req.params.title}, function(err, founditem){
            if(!err){
                res.send(founditem);
            }
            else{
                res.send(err);
            }
        })
    })
    .put(function(req,res){
        Article.update(
            {title: req.params.title}, 
            {title: req.body.title, content: req.body.content},  
            {overwrite: true}, 
            function(err, result){
                if(!err){
                    res.send("Successfully updated");
                }
                else{
                    res.send(err);
                }
            })
    })
    .patch(function(req,res){
        Article.update(
            {title: req.params.title},
            {$set : req.body},
            function(err){
                if(!err){
                    res.send("updated successfully");
                }
                else{
                    res.send(err);
                }
            }
        )
    })
    .delete(function(req,res){
        Article.deleteOne(
            {title: req.params.title},
            function(err){
                if(!err){
                    res.send("deleted Successfully");
                }
                else{
                    res.send(err);
                }
            }
        )
    });



app.listen(3000, function() {
    console.log("server started on port 3000");
});