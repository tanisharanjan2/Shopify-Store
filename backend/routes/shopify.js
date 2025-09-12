const express = require('express');
const router = express.Router();
const { Tenant } = require('../models');
const { fetchProducts, fetchCustomers, fetchOrders } = require('../services/shopifyService');
const { ingestProducts, ingestCustomers, ingestOrders } = require('../services/ingestService');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware, async (req, res, next) => {
  try {
    const tenant = await Tenant.findByPk(req.tenantId);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    const accessToken = tenant.shopifyAccessToken;
    if (!tenant.storeDomain || !accessToken) {
      return res.status(400).json({
        success: false,
        message: 'Tenant is missing Shopify store domain or access token'
      });
    }

    req.tenantConfig = {
      storeDomain: tenant.storeDomain,
      accessToken: accessToken
    };

    next();
  } catch (err) {
    console.error('Tenant Fetch Error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching tenant configuration' });
  }
});

router.get('/sync/products', async (req, res) => {
  try {
    const products = await fetchProducts(req.tenantConfig);
    await ingestProducts(req.tenantId, products);
    res.json({ success: true, count: products.length, message: 'Products synced successfully.' });
  } catch (err) {
    console.error('Products Sync Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/sync/customers', async (req, res) => {
  try {
    const customers = await fetchCustomers(req.tenantConfig);
    await ingestCustomers(req.tenantId, customers);
    res.json({ success: true, count: customers.length, message: 'Customers synced successfully.' });
  } catch (err) {
    console.error('Customers Sync Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/sync/orders', async (req, res) => {
  try {
    const orders = await fetchOrders(req.tenantConfig);
    await ingestOrders(req.tenantId, orders);
    res.json({ success: true, count: orders.length, message: 'Orders synced successfully.' });
  } catch (err) {
    console.error('Orders Sync Error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
