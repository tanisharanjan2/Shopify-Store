const cron = require('node-cron');
const { Tenant } = require('./models');

function startScheduler() {
  
  const cronJob = cron.schedule('* * * * *', async () => {
    try {
      const tenants = await Tenant.findAll();
      
      if (tenants.length > 0) {
        console.log(`[Scheduler] Checking for updates for ${tenants.length} tenant(s) at ${new Date().toISOString()}`);

      }
      
    } catch (error) {
      console.error('[Scheduler] Error fetching tenants:', error);
    }
  });

  console.log('✅ Scheduler has been started and will run every minute.');
  
  return cronJob;
}

module.exports = { startScheduler };