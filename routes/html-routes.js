// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/",  isAuthenticated, function(req, res) {
    // If the user already has an account send them to the main page
    if (req.user) {
      res.redirect("/game");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });


  // takes you to the registration page
  app.get("/register", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/register.html"));
  });


  // takes you to the main
  app.get("/game", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/game.html"));
  });


  app.get("/login", function(req, res) {
   
    if (req.user) {
      res.redirect("/game");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

 

};
