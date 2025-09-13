const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    shopifyId: { 
      type: DataTypes.BIGINT, 
      allowNull: false 
    },
    totalPrice: { 
      type: DataTypes.DECIMAL(12, 2), 
      allowNull: false 
    },
    createdAtShopify: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    tenantId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Tenants', key: 'id' }
    }
  }, { 
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['tenantId', 'shopifyId']
      }
    ]
  });

  
  Order.associate = (models) => {
    Order.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
  };

  return Order;
};
