const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const propertyId = '512079545';

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: 'google-analytics.json'
});

async function runReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: 'today',
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        name: 'city',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
    ],
  });

  console.log('Report result for today:');
  const rows = [];
  response.rows.forEach(row => {
    rows.push({
      city: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value, 10)
    });
  });
  
  rows.sort((a, b) => b.users - a.users);
  
  rows.forEach(r => {
    console.log(`${r.city}: ${r.users} users`);
  });
}

runReport().catch(console.error);
