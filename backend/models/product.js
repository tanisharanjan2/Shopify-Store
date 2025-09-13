const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    shopifyId: { 
      type: DataTypes.BIGINT, 
      allowNull: false 
    },
    title: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    price: { 
      type: DataTypes.DECIMAL(12, 2), 
      allowNull: false 
    },
    tenantId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Tenants', key: 'id' }
    }
  }, { 
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['tenantId', 'shopifyId']
      }
    ]
  });

  
  Product.associate = (models) => {
    Product.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
  };

  return Product;
};
