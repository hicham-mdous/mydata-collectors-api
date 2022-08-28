const notes = [
  {
    groupId: '00000000-0000-4000-8000-000000000001',
    noteTitle: 'First Note',
    noteBody: 'This is body of the first note',
  },
];

const seed = () => {
  return notes.map((item) => {
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
