import checkit from 'checkit';
import { ruleUUID } from 'mdo-backend-tools';

const rulesSingleUuid = new checkit({
  id: [ruleUUID({ errorMsg: 'ID should be an UUID' })],
});

const rulesSingleId = new checkit({
  id: [
    {
      rule: 'required',
      message: 'ID is required',
    },
    {
      rule: 'integer',
      message: 'ID should be an integer',
    },
  ],
});

const rulesSingleTextId = new checkit({
  id: [
    {
      rule: 'required',
      message: 'ID is required',
    },
    {
      rule: 'string',
      message: 'ID should be a string',
    },
  ],
});

const rulesMultipleUuid = new checkit({
  id: [
    {
      rule: 'array',
      message: 'ID should be an array',
    },
  ],
});

const validateGet = async (args) => {
  const [resultInput] = rulesSingleUuid.validateSync(args);

  if (resultInput) {
    return [resultInput, {}];
  }

  return [true, {}];
};

const validateGetById = async (args) => {
  const [resultInput] = rulesSingleTextId.validateSync(args);

  if (resultInput) {
    return [resultInput, {}];
  }

  return [true, {}];
};

const validateGetByTextId = async (args) => {
  const [resultInput] = rulesSingleTextId.validateSync(args);

  if (resultInput) {
    return [resultInput, {}];
  }

  return [true, {}];
};

const validateGetMany = async (args) => {
  const [resultInput] = rulesMultipleUuid.validateSync(args);

  if (resultInput) {
    return [resultInput, {}];
  }

  return [true, {}];
};

const validateRemove = async (args) => {
  const [resultInput] = rulesSingleUuid.validateSync(args);

  if (resultInput) {
    return [resultInput, {}];
  }

  return [true, {}];
};

const validateRemoveById = async (args) => {
  const [resultInput] = rulesSingleId.validateSync(args);

  if (resultInput) {
    return [resultInput, {}];
  }

  return [true, {}];
};

const validateRemoveByTextId = async (args) => {
  const [resultInput] = rulesSingleTextId.validateSync(args);

  if (resultInput) {
    return [resultInput, {}];
  }

  return [true, {}];
};

const validateRemoveMany = async (args) => {
  const [resultInput] = rulesMultipleUuid.validateSync(args);

  if (resultInput) {
    return [resultInput, {}];
  }

  return [true, {}];
};

export {
  validateGet,
  validateGetById,
  validateGetByTextId,
  validateGetMany,
  validateRemove,
  validateRemoveById,
  validateRemoveByTextId,
  validateRemoveMany,
};
