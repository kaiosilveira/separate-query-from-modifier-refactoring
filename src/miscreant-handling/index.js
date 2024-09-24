function setOffAlarms() {
  console.log('Alarms have been set off!');
}

export function alertForMiscreant(people) {
  for (const p of people) {
    if (p === 'Don') {
      setOffAlarms();
      return 'Don';
    }
    if (p === 'John') {
      setOffAlarms();
      return 'John';
    }
  }
  return '';
}

export function findMiscreant(people) {
  for (const p of people) {
    if (p === 'Don') {
      setOffAlarms();
      return 'Don';
    }
    if (p === 'John') {
      setOffAlarms();
      return 'John';
    }
  }
  return '';
}
