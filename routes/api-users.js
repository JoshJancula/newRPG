var passport = require("../config/passport");
var db = require("../models");
var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));



module.exports = function(app) {

    // route to get all the users
    app.get("/api/users", function(req, res) {
        var query = {};
        // find all of them
        db.gameUser.findAll({
            where: query,
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });


    // get user by id
    app.get("/api/users/:id", function(req, res) {

        db.gameUser.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Weapon]
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });



    // update password when user forgets theirs
    app.put("/api/users/email/:email", function(req, res) {

        db.gameUser.update({ // update password
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }, { // update it by email provided
                where: {
                    email: req.body.email
                }
            }).then(function(dbUser) {

                res.json(dbUser);
            })
            .catch(function(err) {

                res.json(err);
            });
    });



    // Route for logging user out
    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });


    // Route for getting some data about our user to be user client side
    app.get("/api/user_data", function(req, res) {

        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        }
        else {
            // Otherwise send back the user's email and id
            res.json({
                email: req.user.email,
                id: req.user.id,
                username: req.user.username,
                health: req.user.health,
                defense: req.user.defense,
                strength: req.user.strength,
                money: req.user.money,
                level: req.user.level,
                streetCredit: req.user.streetCredit,

            }) // and the weapons they have
            include: [db.Weapon]

        }
    });


    // login route
    app.post("/api/login", passport.authenticate("local"), function(req, res) {

        res.redirect("/game");

    });

    // create new user
    app.post("/api/users", function(req, res) {

        // take all this info
        db.gameUser.create({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                health: req.body.health,
                defense: req.body.defense,
                strength: req.body.strength,
                money: req.body.money,
                level: req.body.level,
                streetCredit: req.body.streetCredit,

            }).then(function(dbUser) {

                res.json(dbUser);


            }) // if an error happends catch it
            .catch(function(err) { // then throw some json

                res.json(err);
            });
    });

    // route to delete user account 
    app.delete("/api/users/:id", function(req, res) {
        db.gameUser.destroy({
            where: {
                id: req.params.id
            }

        }).then(function(dbUser) {
            res.json(dbUser);
        });

    });



 // PUT route for updating game
  app.put("/api/users/:username", function(req, res) {
    console.log("begining of PUT: " + JSON.stringify(req.body));
    db.gameUser.update({ 
                username: req.body.username,
                health: req.body.health,
                defense: req.body.defense,
                strength: req.body.strength,
                money: req.body.money,
                level: req.body.level,
                streetCredit: req.body.streetCredit,

      }, { // update it by username
        where: {
          username: req.body.username,
        }
      }).then(function(dbUser) {
       
        res.json(dbUser);
     
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  
  
  // PUT route for updating game
  app.put("/api/user_id", function(req, res) {
    console.log("begining of put on user_id: " + JSON.stringify(req.body));
    db.gameUser.update({ 
                username: req.body.username,
                health: req.body.health,
                defense: req.body.defense,
                strength: req.body.strength,
                money: req.body.money,
                level: req.body.level,
                streetCredit: req.body.streetCredit,

      }, { // update it by username
        where: {
          username: req.body.username,
        }
      }).then(function(dbUser) {
       
        res.json(dbUser);
     
      })
      .catch(function(err) {
        res.json(err);
      });
  });



}
