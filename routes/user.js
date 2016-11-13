var mongoose = require('mongoose');
var chalk = require('chalk');
var User = mongoose.model('User');
var Forum = mongoose.model('Forum');

//this function register user.
exports.regUser = function(req,res){

var fullname = req.body.fullname;
var username = req.body.username;
var email = req.body.email;
var password = req.body.password;
var age = req.body.age;

  var creatUser = new User();
  creatUser.fullname = fullname;
  creatUser.username = username;
  creatUser.email = email;
  creatUser.password = password;
  creatUser.age = age;

//inserting the user into mongodb.
  creatUser.save(function(err, user){
        if(err){
          console.log(chalk.red(err));
          var message="user alread present with same username or email address";
          res.render('Register',{errorMessage:message});
          return;
        }
        else{
          console.log(chalk.green("user registered successfully."));
          req.session.username=user.username;
          res.render('Welcome',{session:req.session});
        }
  });
}

//this function will check the credentials of the registered user while login.
exports.validate= function(req,res){
   var email = req.body.email;
   var password = req.body.password;

   User.findOne({email:email}, function(err, user){
         if(err){
           console.log(chalk.red(" password or email entered wrong."));
           var error = "Invalid password or email.";
           res.render('Login',{errorMessage:error});
           return;
         }
         else{
           user.comparePassword(password, function(err, match){
             if(match){
               console.log(chalk.green("Authentication successfull."));
               req.session.username=user.username;
               req.session.loggedIn=true;
               console.log(chalk.blue("current user loggedIn is:"+req.session.username));
               res.render('Home',{session:req.session});
             }
             else{
               console.log("login unsuccessfull.");
               var error = "Invalid password or email.";
               res.render('Login',{errorMessage:error});
               return;
             }
           });
         }

   });
}



exports.query= function(req,res){
 var topic = req.body.topic;
 var content = req.body.content;

 var inquire = new Forum();
 inquire.topic=topic;
 inquire.body=content;
 inquire.author=req.session.username;
 inquire.time= new Date();

 inquire.save(function(err, savedQuery){
        if(err){
          console.log("oops unable to post your query "+err);
          var message = 'oops unable to post try again later.';
          res.render('Home',{error:message});
        }
        else{
          console.log('Successfully saved.');
          res.redirect('/queries');
        }
 });

}

exports.displayQuery= function(req,res){

  Forum.find({},function(err,query){
       if(err){
         console.log("error while finding").
         return;
       }
       else{
           console.log(query);
           res.render('Content',{query:query,session:req.session});
       }
  });
}

exports.comment = function(req, res){

  var id = req.params.id;
  var comment = req.body.comment;
  var posted_by = new Date();

  Forum.findOne({_id:id}, function(err,data){

       data.comments.push({data:comment,created_by:req.session.username,date:posted_by});

    data.save(function(err,comment){

      if(err){
        console.log(chalk.red("could not save comment"));
      }
      else{
        Forum.find({},function(err,result){
        console.log(result);
        console.log(chalk.green("save successfull."));
        res.redirect('/queries');
        });
      }
    });
  });
}

exports.logout = function(req, res){
    console.log(chalk.blue("Logging  Out :"+req.session.username));
    req.session.destroy();
    res.redirect('/');
}

exports.search = function(req, res){
var key = req.body.search;
Forum.find({"topic":{ "$regex": key, "$options": "i" }},function(err, result){
         if(err){
           console.log("can't find.");
           alert("Try again later.");
         }
         else{
           console.log("found.");
           console.log(result);
           res.render('Content',{session:req.session,query:result});
         }
});

}

exports.checkLogged = function(req, res){

  if(req.session.loggedIn==true){

    console.log(chalk.green("success"));
    console.log(chalk.blue(req.session.username));
    res.render('Home',{session:req.session});

  }
  else{
    console.log(chalk.red("user not logged in."));
    res.redirect('/login');
  }

}
