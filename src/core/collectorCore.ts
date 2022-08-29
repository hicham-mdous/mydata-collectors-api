import { BaseCore, STATUSES } from 'mdo-backend-tools';

import { logger } from '../utils/logger';
import { CollectorGw } from '../gateways';
import {
  validateGetByTextId,
  validateGetMany,
  validateRemoveByTextId,
  validateRemoveMany,
} from './validators/commonRules';

import { validateList, validateCreate, validateUpdate } from './validators/collectorValidators';

class CollectorCore extends BaseCore {
  private CollectorGw: CollectorGw;

  constructor(props) {
    super(props);

    //this.setNeedAuth(true);

    this.CollectorGw = new CollectorGw({ db: this.getDb(), ...props });
  }

  async list(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { params } = args || {};

        logger.debug('Request to list Collectors', args);

        const [checkResut] = await validateList(params);

        if (checkResut !== true) {
          return this.sendValidationFailure(checkResut);
        }

        const items = await this.CollectorGw.list(args);

        return this.send(items);
      },
      doingWhat: 'listing Collectors',
      hasTransaction: false,
    });
  }

  async get(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to get a Collector', args);

        const [checkResult] = await validateGetByTextId(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const item = await this.CollectorGw.get(id);

        return this.send(item ? [item] : []);
      },
      doingWhat: 'getteing a Collector',
      hasTransaction: false,
    });
  }

  async getMany(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to multiple Collectors', args);

        const [checkResult] = await validateGetMany(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.CollectorGw.getMany(id);

        return this.send(items);
      },
      doingWhat: 'getting multiple Collectors',
      hasTransaction: false,
    });
  }

  async create(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { params } = args || {};

        logger.debug('Request to create a Collector', args);

        const [checkResult] = await validateCreate(params);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.CollectorGw.create({
          params: {
            ...params,
            //statusId: params.statusId !== undefined ? params.statusId : STATUSES.ACTIVE,
            createdBy: this.getUserId(),
          },
        });

        return this.send(items);
      },
      doingWhat: 'creating a Collector',
      hasTransaction: true,
    });
  }

  async update(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id, params } = args || {};

        logger.debug('Request to update a Collector', args);

        const [checkResult] = await validateUpdate(params);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.CollectorGw.update({
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
      doingWhat: 'updating a Collector',
      hasTransaction: true,
    });
  }

  async remove(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to remove a Collector', args);

        const [checkResult] = await validateRemoveByTextId(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.CollectorGw.remove({
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
      doingWhat: 'removing a Collector',
      hasTransaction: true,
    });
  }

  async removeMany(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to remove multiple Collectors', args);

        const [checkResult] = await validateRemoveMany(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.CollectorGw.remove({
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
      doingWhat: 'removing multiple Collectors',
      hasTransaction: true,
    });
  }
}

export { CollectorCore };
