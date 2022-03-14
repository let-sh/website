function msToTime(ms: number) {
  if (ms < 1000) {
    return ms.toFixed(1) + 'ms';
  }
  let seconds = (ms / 1000).toFixed(1);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (+seconds < 60) return seconds + 's';
  else if (+minutes < 60) return minutes + 'min';
  else if (+hours < 24) return hours + 'h';
  else return days + 'd';
}

export default msToTime;
