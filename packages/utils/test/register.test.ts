import { describe, expect, test } from 'vitest';
import { register } from '../src';

describe('register', () => {
  test('register', () => {
    register.register({ key: '1' });
    register.register({ key: '2' });
    expect(() => register.register({ key: '2' })).toThrow(
      'register key have exist!',
    );
    register.unregister('2');
    register.register({ key: '2' });
    register.restore();
    const register1 = register.register({ key: '1' });
    register.register({ key: '2' });
    register1.unregister();
    register.restore();
  });
});
