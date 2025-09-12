const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'xeno_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

const db = {};

// --- Model Definitions ---
db.Event = require('./event')(sequelize);
db.OrderItem = require('./orderItem')(sequelize); // keep order-item model

db.Tenant = sequelize.define('Tenant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },

  // ✅ Keep both store URL (merchant site) and store domain (Shopify)
  storeUrl: { type: DataTypes.STRING, allowNull: false, unique: true },
  storeDomain: { type: DataTypes.STRING, allowNull: false, unique: true },

  // ✅ Shopify API token
  shopifyAccessToken: { type: DataTypes.STRING, allowNull: true },

  adminEmail: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  adminPasswordHash: { type: DataTypes.STRING, allowNull: false },
  logoUrl: { type: DataTypes.STRING, allowNull: true }
});

db.Customer = sequelize.define('Customer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  shopifyId: { type: DataTypes.BIGINT, allowNull: false },
  email: { type: DataTypes.STRING },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  totalSpent: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }
}, {
  indexes: [{ unique: true, fields: ['tenantId', 'shopifyId'] }]
});

db.Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  shopifyId: { type: DataTypes.BIGINT, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
  indexes: [{ unique: true, fields: ['tenantId', 'shopifyId'] }]
});

db.Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  shopifyId: { type: DataTypes.BIGINT, allowNull: false },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  createdAtShopify: { type: DataTypes.DATE, allowNull: false }
}, {
  indexes: [{ unique: true, fields: ['tenantId', 'shopifyId'] }]
});

// --- Hooks ---
db.Tenant.beforeCreate(async (tenant) => {
  if (tenant.adminPasswordHash) {
    const salt = await bcrypt.genSalt(10);
    tenant.adminPasswordHash = await bcrypt.hash(tenant.adminPasswordHash, salt);
  }
});

// --- Associations ---
db.Tenant.hasMany(db.Customer, { foreignKey: 'tenantId' });
db.Customer.belongsTo(db.Tenant, { foreignKey: 'tenantId' });

db.Tenant.hasMany(db.Product, { foreignKey: 'tenantId' });
db.Product.belongsTo(db.Tenant, { foreignKey: 'tenantId' });

db.Tenant.hasMany(db.Order, { foreignKey: 'tenantId' });
db.Order.belongsTo(db.Tenant, { foreignKey: 'tenantId' });

db.Customer.hasMany(db.Order, { foreignKey: 'customerId' });
db.Order.belongsTo(db.Customer, { foreignKey: 'customerId' });

db.Order.belongsToMany(db.Product, { through: db.OrderItem, foreignKey: 'orderId' });
db.Product.belongsToMany(db.Order, { through: db.OrderItem, foreignKey: 'productId' });

db.Tenant.hasMany(db.Event, { foreignKey: 'tenantId', onDelete: 'CASCADE' });
db.Event.belongsTo(db.Tenant, { foreignKey: 'tenantId' });

db.Customer.hasMany(db.Event, { foreignKey: 'customerId', onDelete: 'CASCADE' });
db.Event.belongsTo(db.Customer, { foreignKey: 'customerId' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
