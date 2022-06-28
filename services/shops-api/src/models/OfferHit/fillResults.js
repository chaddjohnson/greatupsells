const { min } = require('lodash');
const { DateTime, Interval } = require('luxon');

const fillResults = (results, valueKey) => {
  if (!results?.length) {
    return [];
  }

  const firstResult = min(results, (result) => new Date(result.date));
  const today = DateTime.fromISO('12:00:00Z');
  const firstDate = firstResult ? DateTime.fromISO(firstResult.date) : today;
  const days = Interval.fromDateTimes(firstDate, today).length('days');

  const newResults = [...Array(days).keys()]
    .map((index) => {
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
    })
    .concat(results);

  return newResults;
};

module.exports = fillResults;
