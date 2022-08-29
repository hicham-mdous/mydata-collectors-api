import { BaseCore, STATUSES } from 'mdo-backend-tools';

import { logger } from '../utils/logger';
import { CollectorSourceSystemGw } from '../gateways';
import {
  validateGetByTextId,
  validateGetMany,
  validateRemoveByTextId,
  validateRemoveMany,
} from './validators/commonRules';

import { validateList, validateCreate, validateUpdate } from './validators/collectorSourceSystemValidators';

class CollectorSourceSystemCore extends BaseCore {
  private collectorSourceSystemGw: CollectorSourceSystemGw;

  constructor(props) {
    super(props);

    //this.setNeedAuth(true);

    this.collectorSourceSystemGw = new CollectorSourceSystemGw({ db: this.getDb(), ...props });
  }

  async list(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { params } = args || {};

        logger.debug('Request to list collectorSourceSystems', args);

        const [checkResut] = await validateList(params);

        if (checkResut !== true) {
          return this.sendValidationFailure(checkResut);
        }

        const items = await this.collectorSourceSystemGw.list(args);

        return this.send(items);
      },
      doingWhat: 'listing collectorSourceSystems',
      hasTransaction: false,
    });
  }

  async get(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to get a collectorSourceSystem', args);

        const [checkResult] = await validateGetByTextId(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const item = await this.collectorSourceSystemGw.get(id);

        return this.send(item ? [item] : []);
      },
      doingWhat: 'getteing a collectorSourceSystem',
      hasTransaction: false,
    });
  }

  async getMany(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to multiple collectorSourceSystems', args);

        const [checkResult] = await validateGetMany(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.collectorSourceSystemGw.getMany(id);

        return this.send(items);
      },
      doingWhat: 'getting multiple collectorSourceSystems',
      hasTransaction: false,
    });
  }

  async create(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { params } = args || {};

        logger.debug('Request to create a collectorSourceSystem', args);

        const [checkResult] = await validateCreate(params);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.collectorSourceSystemGw.create({
          params: {
            ...params,
            createdBy: this.getUserId(),
          },
        });

        return this.send(items);
      },
      doingWhat: 'creating a collectorSourceSystem',
      hasTransaction: true,
    });
  }

  async update(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id, params } = args || {};

        logger.debug('Request to update a collectorSourceSystem', args);

        const [checkResult] = await validateUpdate(params);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.collectorSourceSystemGw.update({
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
      doingWhat: 'updating a collectorSourceSystem',
      hasTransaction: true,
    });
  }

  async remove(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to remove a collectorSourceSystem', args);

        const [checkResult] = await validateRemoveByTextId(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.collectorSourceSystemGw.remove({
          where: {
            id,
          },
          params: {
            //statusId: 1000000,
            collectorSourceSystemName: this.getDb().raw(`collectorSourceSystem_name || '~removed'`),
            removedBy: this.getUserId(),
          },
        });

        return this.send(items);
      },
      doingWhat: 'removing a collectorSourceSystem',
      hasTransaction: true,
    });
  }

  async removeMany(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to remove multiple collectorSourceSystems', args);

        const [checkResult] = await validateRemoveMany(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.collectorSourceSystemGw.remove({
          where: {
            id,
          },
          params: {
            //statusId: 1000000,
            collectorSourceSystemName: this.getDb().raw(`collectorSourceSystem_name || '~removed'`),
            removedBy: this.getUserId(),
          },
        });

        return this.send(items);
      },
      doingWhat: 'removing multiple collectorSourceSystems',
      hasTransaction: true,
    });
  }
}

export { CollectorSourceSystemCore };
