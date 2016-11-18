var express = require('express');
var router = express.Router();

// get homepage
router.get('/', ensureAuthenticated, function (req, res){
  res.render('index');
});

// ensures user is authenticated otherwise redirects. we use it above in "get homepage" because if someone
// TYPES in the address, we don't want them to see dashboard. it will redirect them to login.
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    // req.flash('error_msg', 'You are not loggin in');
    res.redirect('/users/login')
  }
}

module.exports = router;
