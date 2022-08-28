import { BaseCore, STATUSES } from 'mdo-backend-tools';

import { logger } from '../utils/logger';
import { GroupGw } from '../gateways';
import {
  validateGetByTextId,
  validateGetMany,
  validateRemoveByTextId,
  validateRemoveMany,
} from './validators/commonRules';

import { validateList, validateCreate, validateUpdate } from './validators/groupValidators';

class GroupCore extends BaseCore {
  private groupGw: GroupGw;

  constructor(props) {
    super(props);

    //this.setNeedAuth(true);

    this.groupGw = new GroupGw({ db: this.getDb(), ...props });
  }

  async list(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { params } = args || {};

        logger.debug('Request to list groups', args);

        const [checkResut] = await validateList(params);

        if (checkResut !== true) {
          return this.sendValidationFailure(checkResut);
        }

        const items = await this.groupGw.list(args);

        return this.send(items);
      },
      doingWhat: 'listing groups',
      hasTransaction: false,
    });
  }

  async get(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to get a group', args);

        const [checkResult] = await validateGetByTextId(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const item = await this.groupGw.get(id);

        return this.send(item ? [item] : []);
      },
      doingWhat: 'getteing a group',
      hasTransaction: false,
    });
  }

  async getMany(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to multiple groups', args);

        const [checkResult] = await validateGetMany(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.groupGw.getMany(id);

        return this.send(items);
      },
      doingWhat: 'getting multiple groups',
      hasTransaction: false,
    });
  }

  async create(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { params } = args || {};

        logger.debug('Request to create a group', args);

        const [checkResult] = await validateCreate(params);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.groupGw.create({
          params: {
            ...params,
            createdBy: this.getUserId(),
          },
        });

        return this.send(items);
      },
      doingWhat: 'creating a group',
      hasTransaction: true,
    });
  }

  async update(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id, params } = args || {};

        logger.debug('Request to update a group', args);

        const [checkResult] = await validateUpdate(params);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.groupGw.update({
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
      doingWhat: 'updating a group',
      hasTransaction: true,
    });
  }

  async remove(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to remove a group', args);

        const [checkResult] = await validateRemoveByTextId(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.groupGw.remove({
          where: {
            id,
          },
          params: {
            //statusId: 1000000,
            groupName: this.getDb().raw(`group_name || '~removed'`),
            removedBy: this.getUserId(),
          },
        });

        return this.send(items);
      },
      doingWhat: 'removing a group',
      hasTransaction: true,
    });
  }

  async removeMany(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to remove multiple groups', args);

        const [checkResult] = await validateRemoveMany(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.groupGw.remove({
          where: {
            id,
          },
          params: {
            //statusId: 1000000,
            groupName: this.getDb().raw(`group_name || '~removed'`),
            removedBy: this.getUserId(),
          },
        });

        return this.send(items);
      },
      doingWhat: 'removing multiple groups',
      hasTransaction: true,
    });
  }
}

export { GroupCore };
