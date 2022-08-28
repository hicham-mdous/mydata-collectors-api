import { BaseCore, STATUSES } from 'mdo-backend-tools';

import { logger } from '../utils/logger';
import { NoteGw } from '../gateways';
import {
  validateGetByTextId,
  validateGetMany,
  validateRemoveByTextId,
  validateRemoveMany,
} from './validators/commonRules';

import { validateList, validateCreate, validateUpdate } from './validators/noteValidators';

class NoteCore extends BaseCore {
  private noteGw: NoteGw;

  constructor(props) {
    super(props);

    //this.setNeedAuth(true);

    this.noteGw = new NoteGw({ db: this.getDb(), ...props });
  }

  async list(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { params } = args || {};

        logger.debug('Request to list notes', args);

        const [checkResut] = await validateList(params);

        if (checkResut !== true) {
          return this.sendValidationFailure(checkResut);
        }

        const items = await this.noteGw.list(args);

        return this.send(items);
      },
      doingWhat: 'listing notes',
      hasTransaction: false,
    });
  }

  async get(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to get a note', args);

        const [checkResult] = await validateGetByTextId(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const item = await this.noteGw.get(id);

        return this.send(item ? [item] : []);
      },
      doingWhat: 'getteing a note',
      hasTransaction: false,
    });
  }

  async getMany(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to multiple notes', args);

        const [checkResult] = await validateGetMany(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.noteGw.getMany(id);

        return this.send(items);
      },
      doingWhat: 'getting multiple notes',
      hasTransaction: false,
    });
  }

  async create(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { params } = args || {};

        logger.debug('Request to create a note', args);

        const [checkResult] = await validateCreate(params);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.noteGw.create({
          params: {
            ...params,
            //statusId: params.statusId !== undefined ? params.statusId : STATUSES.ACTIVE,
            createdBy: this.getUserId(),
          },
        });

        return this.send(items);
      },
      doingWhat: 'creating a note',
      hasTransaction: true,
    });
  }

  async update(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id, params } = args || {};

        logger.debug('Request to update a note', args);

        const [checkResult] = await validateUpdate(params);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.noteGw.update({
          params: {
            ...params,
            //statusId: params.statusId !== undefined ? params.statusId : STATUSES.ACTIVE,
            updatedBy: this.getUserId(),
          },
          where: {
            id,
          },
        });

        return this.send(items);
      },
      doingWhat: 'updating a note',
      hasTransaction: true,
    });
  }

  async remove(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to remove a note', args);

        const [checkResult] = await validateRemoveByTextId(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.noteGw.remove({
          where: {
            id,
          },
          params: {
            //statusId: 1000000,
            removedBy: this.getUserId(),
          },
        });

        return this.send(items);
      },
      doingWhat: 'removing a note',
      hasTransaction: true,
    });
  }

  async removeMany(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to remove multiple notes', args);

        const [checkResult] = await validateRemoveMany(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.noteGw.remove({
          where: {
            id,
          },
          params: {
            //statusId: 1000000,
            removedBy: this.getUserId(),
          },
        });

        return this.send(items);
      },
      doingWhat: 'removing multiple notes',
      hasTransaction: true,
    });
  }
}

export { NoteCore };
