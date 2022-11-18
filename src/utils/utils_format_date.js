import moment from 'moment';
const time = (daytime) => {
  var time = moment(daytime).fromNow();
      if (time.includes('second')) {
        time = time.replace(time, 'Just now');
      } else if (time.includes('a minute ago')) {
        time = time.replace(/a minute/g, '1m');
      } else if (time.includes(' minute')) {
        time = time.replace(/ minutes/g, 'm');
      } else if (time.includes('an hour')) {
        time = time.replace(/an hour/g, '1h');
      } else if (time.includes(' hours')) {
        time = time.replace(/ hours/g, 'h');
      } else if (time.includes('a day')) {
        time = time.replace(/a day/g, '1d');
      } else if (time.includes('days')) {
        time = time.replace(/ days/g, 'd');
      } else if (time.includes('a week')) {
        time = time.replace(/a week/g, '1w');
      } else if (time.includes('weeks')) {
        time = time.replace(/ weeks/g, 'w');
      } else if (time.includes('a month')) {
        time = time.replace(/a month/g, '1m');
      } else if (time.includes('months')) {
        time = time.replace(/ months/g, 'm');
      } else if (time.includes('a year')) {
        time = time.replace(/a year/g, '1y');
      } else if (time.includes('years')) {
        time = time.replace(/ years/g, 'y');
      }
      return time;
}
export default time;