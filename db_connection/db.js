var chalk = require('chalk');
var mongoose = require('mongoose');
var hashing = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var db = 'mongodb://questions:naren539@ds151917.mlab.com:51917/forum';
mongoose.Promise = global.Promise;
mongoose.connect(db);


mongoose.connection.on('connected', function(){
  console.log(chalk.green("conneted to db: "+db));
});

mongoose.connection.on('error', function(){
    console.log(chalk.red("error connecting to db: "+db));
});

mongoose.connection.on('disconnected', function(){
     console.log(chalk.yellow("disconnecting with db: "+db));
});


var userSchema = new mongoose.Schema({
  fullname: String,
  username: {type: String, unique:true},
  email: {type: String, unique:true},
  password: String,
  age: Number
});


userSchema.pre('save', function(next) {
    var user = this;
    console.log("Before Registering the user");
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    hashing.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        console.log("Salt");
        hashing.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            //console.log("Hash : "+hash);
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    hashing.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        callback(null, isMatch);
    });
};

// Build the User model.

module.exports=mongoose.model('User', userSchema);


var forumSchema = new mongoose.Schema({
      author:String,
      topic:String,
      body:String,
      time:{type:Date,default:Date.now},
      comments:[{data:String,created_by:String,date:Date}]
});

module.exports=mongoose.model('Forum',forumSchema);
