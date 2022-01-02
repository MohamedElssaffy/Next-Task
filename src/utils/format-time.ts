export function convertHMS(value: number) {
  let hours: number | string = Math.floor(value / 60); // get hours
  let minutes: number | string = Math.floor(value - hours * 60); // get minutes

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  return hours + ':' + minutes; // Return is HH : MM : SS
}
