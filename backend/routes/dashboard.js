//routes-dashboard.js

const express = require('express');
const router = express.Router();
const { Tenant, Customer, Order, Product, Event, sequelize } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require('../middleware/auth');

// --- Dashboard Overview ---
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId; 
    if (!tenantId) return res.status(400).json({ msg: 'Tenant ID missing' });

    const totalCustomers = await Customer.count({ where: { tenantId } });
    const totalOrders = await Order.count({ where: { tenantId } });
    const totalRevenue = await Order.sum('totalPrice', { where: { tenantId } });

    res.json({
      totalCustomers,
      totalOrders,
      revenue: totalRevenue || 0
    });
  } catch (error) {
    console.error('Overview Error:', error);
    res.status(500).send('Server Error');
  }
});

// --- Orders ---
router.get('/orders', authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { from, to } = req.query;
    const where = { tenantId };

    if (from || to) {
      where.createdAtShopify = {};
      if (from) where.createdAtShopify[Op.gte] = new Date(from);
      if (to) where.createdAtShopify[Op.lte] = new Date(to);
    }

    const orders = await Order.findAll({
      where,
      order: [['createdAtShopify', 'DESC']],
      limit: 50,
      include: [
        { model: Product, attributes: ['title'], through: { attributes: [] } },
        { model: Customer, attributes: ['firstName', 'lastName'] }
      ]
    });
    res.json({ orders });
  } catch (error) {
    console.error('Get Orders Error:', error);
    res.status(500).send('Server Error');
  }
});

// --- Top Customers Chart ---
router.get('/top-customers-chart', authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) return res.status(400).json({ msg: 'Tenant ID missing' });

    const customers = await Customer.findAll({
      where: { tenantId },
      order: [['totalSpent', 'DESC']],
      limit: 5
    });

    const top = customers.map(c => ({
      name: `${c.firstName} ${c.lastName}`,
      spend: parseFloat(c.totalSpent) || 0
    }));

    res.json(top);
  } catch (error) {
    console.error('Top Customers Chart Error:', error);
    res.status(500).send('Server Error');
  }
});

// --- Customer Products (Order IDs) ---
router.get('/customer-products', authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) return res.status(400).json({ msg: 'Tenant ID missing' });

    const customers = await Customer.findAll({
      where: { tenantId },
      include: [{ model: Order, attributes: ['shopifyId'] }]
    });

    const result = customers.map(customer => ({
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      orders: customer.Orders.map(order => order.shopifyId)
    }));

    res.json(result);
  } catch (error) {
    console.error('Customer Orders Error:', error);
    res.status(500).send('Server Error');
  }
});

// --- Tenant Info ---
router.get('/tenant-info', authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) return res.status(400).json({ msg: 'Tenant ID missing' });

    const tenant = await Tenant.findByPk(tenantId, {
      attributes: ['name', 'adminEmail', 'logoUrl']
    });

    if (!tenant) return res.status(404).json({ msg: 'Tenant not found' });

    res.json(tenant);
  } catch (error) {
    console.error('Tenant Info Error:', error);
    res.status(500).send('Server Error');
  }
});

// --- Events Summary ---
router.get('/events-summary', authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) return res.status(400).json({ msg: 'Tenant ID missing' });

    const summary = await Event.findAll({
      where: { tenantId },
      attributes: [
        'eventName',
        [sequelize.fn('COUNT', sequelize.col('eventName')), 'count']
      ],
      group: ['eventName']
    });

    const formatted = summary.reduce((acc, item) => {
      acc[item.eventName] = item.get('count');
      return acc;
    }, {});

    res.json(formatted);
  } catch (error) {
    console.error('Events Summary Error:', error);
    res.status(500).send('Server Error');
  }
});

// --- Sales Trend (Last 30 Days) ---
router.get('/sales-trend', authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) return res.status(400).json({ msg: 'Tenant ID missing' });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await Order.findAll({
      where: {
        tenantId,
        createdAtShopify: { [Op.gte]: thirtyDaysAgo }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAtShopify')), 'date'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAtShopify'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAtShopify')), 'ASC']]
    });

    res.json(salesData);
  } catch (error) {
    console.error('Sales Trend Error:', error);
    res.status(500).send('Server Error');
  }
});

// --- Customer History ---
router.get('/customer-history', authMiddleware, async (req, res) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) return res.status(400).json({ msg: 'Tenant ID missing' });

    const customers = await Customer.findAll({
      where: { tenantId },
      include: [{ model: Order, attributes: ['shopifyId', 'totalPrice', 'createdAtShopify'] }, {
          model: Event,
          attributes: ['eventName', 'createdAt'],
          limit: 5, // Get the 5 most recent events
          order: [['createdAt', 'DESC']]
        }]
    });

    const result = customers.map(c => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
      Orders: c.Orders || []
    }));

    res.json({ customerHistory: result });
  } catch (error) {
    console.error('Customer History Error:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
