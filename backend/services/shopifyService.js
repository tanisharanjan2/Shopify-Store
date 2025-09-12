const axios = require('axios');

function createShopifyAPI(tenantConfig) {
  if (!tenantConfig?.storeDomain || !tenantConfig?.accessToken) {
    throw new Error('Missing tenant Shopify configuration');
  }

  return axios.create({
    baseURL: `https://${tenantConfig.storeDomain}/admin/api/2023-07/`,
    headers: {
      'X-Shopify-Access-Token': tenantConfig.accessToken,
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });
}

function handleShopifyError(err, entity) {
  if (err.response) {
    console.error(`${entity} Fetch Error:`, err.response.status, err.response.data.errors || err.response.data);
    throw new Error(`Shopify API error (${err.response.status}): ${JSON.stringify(err.response.data)}`);
  } else {
    console.error(`${entity} Fetch Error:`, err.message);
    throw new Error(`Failed to fetch ${entity} from Shopify: ${err.message}`);
  }
}

async function fetchProducts(tenantConfig) {
  try {
    const api = createShopifyAPI(tenantConfig);
    const res = await api.get('products.json');
    return res.data.products.map(product => ({
      id: product.id,
      title: product.title,
      price: product.variants[0]?.price || '0.00',
    }));
  } catch (err) {
    handleShopifyError(err, 'Products');
  }
}

async function fetchCustomers(tenantConfig) {
  try {
    const api = createShopifyAPI(tenantConfig);
    const res = await api.get('customers.json');
    return res.data.customers;
  } catch (err) {
    handleShopifyError(err, 'Customers');
  }
}

async function fetchOrders(tenantConfig) {
  try {
    const api = createShopifyAPI(tenantConfig);
    const res = await api.get('orders.json');
    return res.data.orders;
  } catch (err) {
    handleShopifyError(err, 'Orders');
  }
}

module.exports = {
  fetchProducts,
  fetchCustomers,
  fetchOrders
};
