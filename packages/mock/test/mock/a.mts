import mockjs from 'better-mock';

export default {
  '/api/a': { a: 'test_aa' },
  'GET /api/mock': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 10, 'type|0-2': 1 }],
  }),
};
