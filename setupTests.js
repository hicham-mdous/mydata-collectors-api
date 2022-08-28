const cache = require('./cache');

beforeAll((done) => {
  global.cache = cache;

  global.mockRequest = (data) => {
    return {
      body: data,
    };
  };

  global.mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.type = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  done();
});

afterEach((done) => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  done();
});
