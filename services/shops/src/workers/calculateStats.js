const fs = require('fs-extra');
const isLambda = require('is-lambda');
const moment = require('moment-timezone');
const { logger, cleanTmp } = require('../utilities');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await logger.info(`Running job calculateStats`);

  try {
    if (isLambda) {
      await fs.emptyDir('/tmp');
    }

    const Stat = await models.get('Stat');
    const date = moment().utc().format('YYYY-MM-DDT23:59:59Z');
    const currentHour = parseInt(moment().tz('America/Chicago').format('HH'));

    // Account for daylight savings by only running at midnight US Central time.
    if (currentHour !== 0) {
      return;
    }

    const startDate = moment(date)
      .tz('America/Chicago')
      .subtract(1, 'day')
      .startOf('day')
      .toDate();
    const endDate = moment(date)
      .tz('America/Chicago')
      .subtract(1, 'day')
      .endOf('day')
      .toDate();
    const stat = await Stat.calculate(startDate, endDate);

    stat.createdAt = startDate;

    await Stat.create(stat);
  } catch (error) {
    await logger.warn(`Error alculating status for today`, error, event);
    throw error;
  }
};
