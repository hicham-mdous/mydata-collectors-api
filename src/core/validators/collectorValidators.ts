import checkit from 'checkit';

const rulesFilter = new checkit({
  id: [
    {
      rule: 'array',
      message: 'ID should be an array of strings',
    },
  ],
  keyword: [
    {
      rule: 'string',
      message: 'ID should be a valid string',
    },
  ],
});

const rulesCreateUpdate = new checkit({
  id: [
    {
      rule: 'uuid',
      message: 'ID should be a valid UUID',
    },
  ],
  name: [
    {
      rule: 'required',
      message: 'Title is required',
    },
    {
      rule: 'string',
      message: 'Title should be a valid string',
    },
  ],
});

const validateList = async (args: any) => {
  const [resultInput] = rulesFilter.validateSync(args);

  if (resultInput) {
    return [resultInput, {}];
  }

  return [true, {}];
};

const validateCreate = async (args: any /*, core: BaseCore */) => {
  const [result] = rulesCreateUpdate.validateSync(args);

  if (result) {
    return [result, {}];
  }

  return [true, {}];
};

const validateUpdate = async (args: any /*, id: string, core: BaseCore */) => {
  const [result] = rulesCreateUpdate.validateSync(args);

  if (result) {
    return [result, {}];
  }

  return [true, {}];
};

export { validateList, validateCreate, validateUpdate };
