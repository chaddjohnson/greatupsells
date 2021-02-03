const moment = require('moment-timezone');
const mongodbClient = require('../mongodbClient');

const calculateToday = async () => {
  const Stats = mongodbClient.connection.model('Stats');
  const date = moment().utc().format('YYYY-MM-DDT23:59:59Z');
  const currentHour = parseInt(moment().tz('America/New_York').format('HH'));

  // Account for daylight savings by ensuring calculations are only performed at midnight.
  if (currentHour !== 0) {
    return;
  }

  const startDate = moment(date)
    .tz('America/New_York')
    .subtract(1, 'day')
    .startOf('day')
    .toDate();
  const endDate = moment(date)
    .tz('America/New_York')
    .subtract(1, 'day')
    .endOf('day')
    .toDate();
  const stats = await Stats.calculate(startDate, endDate);

  stats.createdAt = startDate;

  await Stats.create(stats);
};

module.exports = calculateToday;
