function setOffAlarms() {
  console.log('Alarms have been set off!');
}

export function alertForMiscreant(people) {
  if (findMiscreant(people) !== '') {
    setOffAlarms();
  }
}

export function findMiscreant(people) {
  for (const p of people) {
    if (p === 'Don') {
      return 'Don';
    }
    if (p === 'John') {
      return 'John';
    }
  }
  return '';
}
