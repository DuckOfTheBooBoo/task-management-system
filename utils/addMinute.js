function addMinute(dt, minutes) {
  const newDate = dt.getTime() + minutes * 60000;
  console.log(newDate);
  return new Date(newDate);
}

module.exports = addMinute;
