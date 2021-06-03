// Luxon is used because it uses Intl.DateTimeFormat directly and requires no locale data be imported.
import { DateTime } from 'luxon';

const useDateTime = (locale = 'en-us') => {
  // See https://moment.github.io/luxon/docs/manual/formatting#table-of-tokens.
  const formatDate = (date = Date.now(), format) => {
    return (
      date && DateTime.fromISO(new Date(date).toISOString()).toFormat(format)
    );
  };

  const formatDateISO = (date = Date.now()) => {
    return date && DateTime.fromISO(new Date(date).toISOString()).toISODate();
  };

  // See https://moment.github.io/luxon/docs/manual/formatting#presets.
  const formatDateLocale = (
    date = Date.now(),
    format = DateTime.DATETIME_SHORT
  ) => {
    return (
      date &&
      DateTime.fromISO(new Date(date).toISOString(), {
        locale
      }).toLocaleString(format)
    );
  };

  const formatDateRelative = (date) => {
    // Force use of English as the app does not localize text strings.
    return (
      date &&
      DateTime.fromISO(new Date(date).toISOString(), {
        locale: 'en-us'
      }).toRelative()
    );
  };

  const startOfDay = (date = Date.now()) => {
    return (
      date &&
      DateTime.fromISO(new Date(date).toISOString()).startOf('day').toJSDate()
    );
  };

  const addTime = (date, value, unit) => {
    return (
      date &&
      DateTime.fromISO(new Date(date).toISOString())
        .plus({
          [unit]: value
        })
        .toJSDate()
    );
  };

  const subtractTime = (date, value, unit) => {
    return (
      date &&
      DateTime.fromISO(new Date(date).toISOString())
        .minus({
          [unit]: value
        })
        .toJSDate()
    );
  };

  return {
    formatDate,
    formatDateISO,
    formatDateLocale,
    formatDateRelative,
    startOfDay,
    addTime,
    subtractTime
  };
};

export default useDateTime;
