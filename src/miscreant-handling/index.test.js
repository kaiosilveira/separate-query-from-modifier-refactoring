import { jest, expect } from '@jest/globals';
import { alertForMiscreant } from './index';

describe('alertForMiscreant', () => {
  const spy = jest.spyOn(console, 'log');

  beforeEach(() => spy.mockClear());

  it('should set off alarms for Don', () => {
    const result = alertForMiscreant(['Don']);
    expect(result).toBe('Don');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set off alarms for John', () => {
    const reuslt = alertForMiscreant(['John']);
    expect(reuslt).toBe('John');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not set off alarms for other people', () => {
    const result = alertForMiscreant(['Alice']);
    expect(result).toBe('');
    expect(spy).not.toHaveBeenCalled();
  });
});
