export function processDate(date) {
  const theDate = new Date(date).getTime();
  const today = new Date().getTime();
  const difference = today - theDate;
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = month * 12;

  const yearDiff = difference / year;
  if (yearDiff >= 1) {
    if (yearDiff < 2) {
      return `a year ago`;
    } else {
      return `${Math.floor(yearDiff)} years ago`;
    }
  }

  const monthDiff = difference / month;
  if (monthDiff >= 1) {
    if (monthDiff < 2) {
      return `a month ago`;
    } else {
      return `${Math.floor(monthDiff)} months ago`;
    }
  }

  const weekDiff = difference / week;
  if (weekDiff >= 1) {
    if (weekDiff < 2) {
      return `a week ago`;
    } else {
      return `${Math.floor(weekDiff)} week ago`;
    }
  }

  const dayDiff = difference / day;
  if (dayDiff >= 1) {
    if (dayDiff < 2) {
      return `a day ago`;
    } else {
      return `${Math.floor(dayDiff)} days ago`;
    }
  }

  const hourDiff = difference / hour;
  if (hourDiff >= 1) {
    if (hourDiff < 2) {
      return `an hour ago`;
    } else {
      return `${Math.floor(hourDiff)} hours ago`;
    }
  }

  const minuteDiff = difference / minute;
  if (minuteDiff >= 1) {
    if (minuteDiff < 2) {
      return `a minute ago`;
    } else {
      return `${Math.floor(minuteDiff)} minutes ago`;
    }
  }

  const secondsDiff = difference / second;
  if (secondsDiff >= 1) {
    if (secondsDiff < 2) {
      return `a second ago`;
    } else {
      return `${Math.floor(secondsDiff)} seconds ago`;
    }
  }
}