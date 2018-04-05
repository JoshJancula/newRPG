module.exports = function(sequelize, DataTypes) {
  var Weapon = sequelize.define("Weapon", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
      len: [1]
    },
    
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      len: [0]
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [0]
    }
  });

  Weapon.associate = function(models) {
   
    Weapon.belongsTo(models.gameUser, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Weapon;
};
