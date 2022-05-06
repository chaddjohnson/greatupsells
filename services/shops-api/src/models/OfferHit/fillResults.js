const { min } = require('lodash');
const { DateTime, Interval } = require('luxon');

const fillResults = (results, valueKey) => {
  const firstResult = min(results, (result) => new Date(result.date));
  const firstDate = DateTime.fromISO(firstResult.date);
  const today = DateTime.fromISO('12:00:00Z');
  const days = Interval.fromDateTimes(firstDate, today).length('days');

  const newResults = [...Array(days).keys()].map((index) => {
    const targetDateString = firstDate.plus({ days: index }).toISODate();
    let resultDate = results.find((result) => {
      const resultDateString = DateTime.fromISO(result.date).toISODate();

      return resultDateString === targetDateString;
    });

    resultDate = resultDate || {
      date: DateTime.fromISO(`${targetDateString}T12:00:00Z`)
        .toJSDate()
        .toISOString(),
      [valueKey]: 0
    };

    return resultDate;
  });

  return newResults;
};

module.exports = fillResults;
