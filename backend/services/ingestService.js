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

// --- 2. ADDED: New function to save Shopify customer events ---
async function ingestEvents(tenantId, shopifyEvents) {
  for (const event of shopifyEvents) {
    // Only process events that are linked to a customer
    if (event.subject_type !== 'Customer') continue;

    // Find the customer in our database that this event belongs to
    const customer = await Customer.findOne({ where: { shopifyId: event.subject_id, tenantId } });

    if (customer) {
      // Create the event record if it doesn't already exist
      // This prevents creating duplicate events if you sync multiple times
      await Event.findOrCreate({
        where: {
          tenantId,
          customerId: customer.id,
          eventName: event.verb, // e.g., 'created', 'updated_payment_method'
          createdAt: event.created_at // Use the original timestamp from Shopify
        },
        defaults: {
          // Store extra info from Shopify in the details column
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
  // --- 3. ADDED: Export the new function ---
  ingestEvents,
};