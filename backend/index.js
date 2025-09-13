require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');


const app = express();


const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'https://shopify-store-frontend.onrender.com' 
  ]
};
app.use(cors(corsOptions));


app.use(express.json());

const shopifyRoutes = require('./routes/shopify');
app.use('/api/shopify', shopifyRoutes);


app.use('/api/auth', require('./routes/auth'));
app.use('/api/ingest', require('./routes/ingest'));
app.use('/api/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await db.sequelize.sync(); 
    console.log('DB connected & models synced');
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}
start();