// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all saved weapons
  app.get("/api/weapons", function(req, res) {
    var query = {};
    if (req.query.id) {
      query.id = req.query.id;
    }

    db.Weapon.findAll({
      where: query,
      include: [db.gameUser]
    }).then(function(dbWeapon) {
      res.json(dbWeapon);
    });
  });

  // Get rotue for retrieving a single weapon
  app.get("/api/weapons/:id", function(req, res) {

    db.Weapon.findOne({
      where: {
        id: req.params.id
      },
      include: [db.gameUser]
    }).then(function(dbWeapon) {
      res.json(dbWeapon);
    });
  });

  // POST route for saving a new weapon
  app.post("/api/weapons", function(req, res) {
    db.Weapon.create(req.body).then(function(dbWeapon) {
      res.json(dbWeapon);
    });
  });

  // DELETE route for deleting weapons
  app.delete("/api/weapons/:id", function(req, res) {
    db.Weapon.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbWeapon) {
      res.json(dbWeapon);
    });
  });
  
  
  // update your inventory
    app.put("/api/weapons/:id", function(req, res) {
    db.Weapon.update({ 
                quantity: req.body.quantity,
      }, {
        where: {
          id: req.params.id
        }
      }).then(function(dbWeapon) {
        res.json(dbWeapon);
      });
  });




};
