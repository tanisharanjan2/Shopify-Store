const express = require('express');
const router = express.Router();

const { Customer, Product, Order, Event, OrderItem, sequelize } = require('../models');
const authMiddleware = require('../middleware/auth');


router.post('/products', authMiddleware, async (req, res) => {
  const { tenantId } = req; 
  const items = Array.isArray(req.body) ? req.body : [req.body];

  try {
    for (const item of items) {
      await Product.findOrCreate({
        where: { shopifyId: item.shopifyId, tenantId },
        defaults: {
          title: item.title,
          price: item.price,
        }
      });
    }
    res.status(201).json({ msg: `Successfully ingested ${items.length} products.` });
  } catch (error) {
    console.error('Error ingesting products:', error);
    res.status(500).json({ msg: 'Failed to ingest products.' });
  }
});


router.post('/customers', authMiddleware, async (req, res) => {
  const { tenantId } = req; 
  const items = Array.isArray(req.body) ? req.body : [req.body];

  try {
    for (const item of items) {
      await Customer.findOrCreate({
        
        where: { shopifyId: item.shopifyId, tenantId },
        defaults: {
          
          email: item.email,
          firstName: item.firstName,
          lastName: item.lastName,
        }
      });
    }
    res.status(201).json({ msg: `Successfully ingested ${items.length} customers.` });
  } catch (error) {
    console.error('Error ingesting customers:', error);
    res.status(500).json({ msg: 'Failed to ingest customers.' });
  }
});


router.delete('/tenant/all-data', authMiddleware, async (req, res) => {
  const { tenantId } = req;
  const transaction = await sequelize.transaction();
  try {
    
    await Order.destroy({ where: { tenantId }, transaction });
    await Event.destroy({ where: { tenantId }, transaction });
    await Customer.destroy({ where: { tenantId }, transaction });
    await Product.destroy({ where: { tenantId }, transaction });
    
    await transaction.commit();
    res.status(200).json({ msg: 'All data has been cleared.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error clearing data:', error);
    res.status(500).json({ msg: 'Failed to clear data.' });
  }
});


router.post('/orders', authMiddleware, async (req, res) => {
  const { tenantId } = req; 
  const items = Array.isArray(req.body) ? req.body : [req.body];

  const transaction = await sequelize.transaction();
  try {
    for (const o of items) {
      if (!o.customer || !o.customer.id) continue;

      const [customer] = await Customer.findOrCreate({
        where: { shopifyId: o.customer.id, tenantId },
        transaction
      });

      const [order, created] = await Order.findOrCreate({
        
        where: { shopifyId: o.shopifyId, tenantId },
        defaults: {
          customerId: customer.id,
          totalPrice: o.totalPrice,
          createdAtShopify: o.createdAtShopify,
        },
        transaction
      });

      if (created) {
        if (o.line_items && o.line_items.length > 0) {
          for (const lineItem of o.line_items) {
            const product = await Product.findOne({
              where: { shopifyId: lineItem.product_id, tenantId },
              transaction
            });

            if (product) {
              await order.addProduct(product, {
                through: { quantity: lineItem.quantity, price: lineItem.price },
                transaction
              });
            }
          }
        }
        await customer.increment('totalSpent', { by: parseFloat(o.totalPrice), transaction });
      }
    }
    await transaction.commit();
    res.status(201).json({ msg: `Successfully ingested ${items.length} orders.` });
  } catch (error) {
    console.error('Error ingesting orders:', error);
    await transaction.rollback();
    res.status(500).json({ msg: 'Failed to ingest orders.' });
  }
});


router.post('/events', authMiddleware, (req, res) => {
  res.status(200).send();
});

module.exports = router;