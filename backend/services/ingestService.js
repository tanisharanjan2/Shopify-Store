// --- 1. Import the 'Event' model ---
const { Customer, Product, Order, OrderItem, Event, sequelize } = require('../models');

async function ingestProducts(tenantId, items) {
  for (const item of items) {
    await Product.findOrCreate({
      where: { shopifyId: item.id || item.shopifyId, tenantId },
      defaults: {
        title: item.title,
        price: item.price
      }
    });
  }
}

async function ingestCustomers(tenantId, items) {
  for (const item of items) {
    await Customer.findOrCreate({
      where: { shopifyId: item.id || item.shopifyId, tenantId },
      defaults: {
        email: item.email,
        firstName: item.first_name || item.firstName,
        lastName: item.last_name || item.lastName,
      }
    });
  }
}

async function ingestOrders(tenantId, items) {
  const transaction = await sequelize.transaction();
  try {
    for (const o of items) {
      if (!o.customer || !o.customer.id) continue;

      const [customer] = await Customer.findOrCreate({
        where: { shopifyId: o.customer.id, tenantId },
        transaction
      });

      const [order, created] = await Order.findOrCreate({
        where: { shopifyId: o.id || o.shopifyId, tenantId },
        defaults: {
          customerId: customer.id,
          totalPrice: o.total_price || o.totalPrice,
          createdAtShopify: o.created_at || o.createdAtShopify,
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
        await customer.increment('totalSpent', { by: parseFloat(o.total_price || o.totalPrice), transaction });
      }
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}


async function ingestEvents(tenantId, shopifyEvents) {
  for (const event of shopifyEvents) {
    
    if (event.subject_type !== 'Customer') continue;

    
    const customer = await Customer.findOne({ where: { shopifyId: event.subject_id, tenantId } });

    if (customer) {
      
      await Event.findOrCreate({
        where: {
          tenantId,
          customerId: customer.id,
          eventName: event.verb, 
          createdAt: event.created_at 
        },
        defaults: {
          
          details: {
            message: event.message,
            author: event.author,
            description: event.description,
          }
        }
      });
    }
  }
}

module.exports = {
  ingestProducts,
  ingestCustomers,
  ingestOrders,
  ingestEvents,
};