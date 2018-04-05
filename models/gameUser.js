var Promise = require('bluebird')
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

module.exports = function(sequelize, DataTypes) {
  var gameUser = sequelize.define("gameUser", {
    email: { // email address
     id: { // we will use this as primary key
      type: DataTypes.INTEGER,
      primaryKey: true
    },
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: { // the users password
        type: DataTypes.STRING,
        allowNull: false,
        len: [1]
    },
    username: { // their username
        type: DataTypes.STRING,
         unique: true,
        allowNull: false,
        len: [1]
    },
    health: {
         type: DataTypes.INTEGER,
        allowNull: false,
        len: [1]
    },
    defense: {
         type: DataTypes.INTEGER,
        allowNull: false,
       
    },
    strength: {
         type: DataTypes.INTEGER,
        allowNull: false,
      
    },
    money: {
         type: DataTypes.INTEGER,
        allowNull: false,
     
    },
    level: {
         type: DataTypes.INTEGER,
        allowNull: false,
      
    },
    streetCredit: {
         type: DataTypes.INTEGER,
        allowNull: false,
     
    }
    
  }); // check to make sure password is correct
 gameUser.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
 // before we create the user encrypt the password
  gameUser.hook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  
  gameUser.associate = function(models) {
    // Associating the user with their saved recipes
    gameUser.hasMany(models.Weapon, {
      onDelete: "cascade"
    });
  };
  return gameUser;
};