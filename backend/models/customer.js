const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    shopifyId: { 
      type: DataTypes.BIGINT, 
      allowNull: false 
    },
    email: { 
      type: DataTypes.STRING 
    },
    firstName: { 
      type: DataTypes.STRING 
    },
    lastName: { 
      type: DataTypes.STRING 
    },
    totalSpent: { 
      type: DataTypes.DECIMAL(12, 2), 
      defaultValue: 0.00 
    },
    tenantId: { // ✅ added
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

  
  Customer.associate = (models) => {
    Customer.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
  };

  return Customer;
};
