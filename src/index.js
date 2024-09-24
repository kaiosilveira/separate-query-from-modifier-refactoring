import { alertForMiscreant, findMiscreant } from './miscreant-handling';

const people = ['Don', 'John'];
const found = findMiscreant(people);
console.log(found);
alertForMiscreant(people);
