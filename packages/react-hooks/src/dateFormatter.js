import moment from 'moment-timezone';

// TODO: Explore using date-fns or another library having a smaller footprint than moment.

const useDateFormatter = () => {
  const formatDate = (
    dateString,
    dateFormat = 'MM/DD/YYYY hh:mm a',
    timezone = moment.tz.guess()
  ) => {
    return moment(new Date(dateString)).tz(timezone).format(dateFormat);
  };

  const formatDateRelative = (dateString, timezone = moment.tz.guess()) => {
    return moment(new Date(dateString))
      .tz(timezone)
      .startOf('minute')
      .fromNow();
  };

  return { formatDate, formatDateRelative };
};

export default useDateFormatter;
