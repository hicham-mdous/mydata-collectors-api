const { createSeedsFromCsv } = require('../../helpers');

const seed = () => {
  return createSeedsFromCsv({
    fileName: './database/seeds/objects/group.csv',
    pickFields: ['id', 'group_name'],
  }).map((item) => {
    return {
      ...item,
      createdBy: 0,
      updatedBy: 0,
      createdAt: '2022-06-01T00:00:00Z',
      updatedAt: '2022-06-01T00:00:00Z',
    };
  });
};

module.exports = seed;
