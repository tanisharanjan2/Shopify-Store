const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Tenant } = require('../models');


router.post('/signup', async (req, res) => {
  const { name, storeUrl, storeDomain, accessToken, email, password } = req.body;

  if (!name || !storeUrl || !email || !password) {
    return res.status(400).json({ msg: 'Please provide name, storeUrl, email, and password.' });
  }

  try {
    
    const generatedLogoUrl = `https://www.google.com/s2/favicons?domain=${storeUrl}&sz=128`;

    const tenant = await Tenant.create({
      name,
      storeUrl,
      storeDomain: storeDomain || null,          
      shopifyAccessToken: accessToken || null,  
      adminEmail: email,
      adminPasswordHash: password, 
      logoUrl: generatedLogoUrl
    });

    const payload = { tenantId: tenant.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.status(201).json({
      token,
      tenant: { id: tenant.id, name: tenant.name, email: tenant.adminEmail }
    });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ msg: 'A tenant with this email or store URL already exists.' });
    }
    console.error('Signup Error:', error);
    res.status(500).send('Server Error');
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide both email and password.' });
  }

  try {
    const tenant = await Tenant.findOne({ where: { adminEmail: email } });
    if (!tenant) {
      return res.status(401).json({ msg: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, tenant.adminPasswordHash);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials.' });
    }

    const payload = { tenantId: tenant.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.json({
      token,
      tenant: { id: tenant.id, name: tenant.name, email: tenant.adminEmail }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
