var mongoose = require('mongoose');
var chalk = require('chalk');
var Forum = mongoose.model('Forum');
exports.login=function(req,res){
  res.render('Login');
}

exports.register=function(req,res){
  res.render('Register');
}

exports.index=function(req,res){
  Forum.find({},function(err, query){
       if(err){
         console.log(chalk.red("no queies."));
       }
       else{
         console.log(chalk.green("got them."));
         res.render('Content',{query:query,session:req.session});
       }

  });
}
