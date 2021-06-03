const { DateTime } = require('luxon');
const mongodbClient = require('../mongodbClient');

const calculateToday = async () => {
  const Stats = mongodbClient.connection.model('Stats');

  // Use end of day UTC time to ensure the day has rolled over.
  const date = DateTime.utc().endOf('day').toJSDate();

  const currentHour = parseInt(
    DateTime.fromISO(date, {
      zone: 'America/New_York'
    }).toFormat('H')
  );

  // Account for daylight savings by ensuring calculations are only performed at midnight.
  if (currentHour !== 0) {
    return;
  }

  const startDate = DateTime.fromISO(date, { zone: 'America/New_York' })
    .minus({ day: 1 })
    .startOf('day')
    .toJSDate();
  const endDate = DateTime.fromISO(date, { zone: 'America/New_York' })
    .minus({ day: 1 })
    .endOf('day')
    .toJSDate();
  const stats = await Stats.calculate(startDate, endDate);

  stats.createdAt = startDate;

  await Stats.create(stats);
};

module.exports = calculateToday;
