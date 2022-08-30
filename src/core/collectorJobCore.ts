import { BaseCore, STATUSES } from 'mdo-backend-tools';

import { logger } from '../utils/logger';
import { CollectorJobGw } from '../gateways';
import {
  validateGetByTextId,
  validateGetMany,
  validateRemoveByTextId,
  validateRemoveMany,
} from './validators/commonRules';

import { validateList, validateCreate, validateUpdate } from './validators/collectorValidators';
import { scheduledJobs, Job} from 'node-schedule';

class CollectorJobCore extends BaseCore {
  private collectorJobGw: CollectorJobGw;

  constructor(props) {
    super(props);

    //this.setNeedAuth(true);

    this.collectorJobGw = new CollectorJobGw({ db: this.getDb(), ...props });
  }

  async list(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { params } = args || {};

        logger.debug('Request to list CollectorJobs', args);

        const [checkResut] = await validateList(params);

        if (checkResut !== true) {
          return this.sendValidationFailure(checkResut);
        }

        const items = await this.collectorJobGw.list(args);
        const enrichedItems = await this.enrichJobs({ items })
        console.log(enrichedItems)
        return this.send(enrichedItems);
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

        const item = await this.collectorJobGw.get(id);

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

        const items = await this.collectorJobGw.getMany(id);

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

        logger.debug('Request to create a CollectorJob', args);

        // const [checkResult] = await validateCreate(params);

        // if (checkResult !== true) {
        //   return this.sendValidationFailure(checkResult);
        // }

        const items = await this.collectorJobGw.create({params});
        this.scheduleJobs({ items })

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

        const items = await this.collectorJobGw.update({
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

        const items = await this.collectorJobGw.remove({
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

        const items = await this.collectorJobGw.remove({
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

  async enrichJobs(args) {
    let { items } = args
    let enrichedItems = items.map( item => {
      let job = scheduledJobs[item.name]
      console.log(job)
      item.running = job['running']
      item.scheduled = false
      item.nextInvocationTime = job.nextInvocation().toString()
      return item;
    })
    return enrichedItems
  }

  async scheduleJobs(args) {
      let { items }= args
      items.forEach( item => {
        let job = new Job(item.name, async () => {console.log('start job',item.name)})
        job.schedule('* * * * *')
        item.running = job['running']
        item.nextInvocationTime = job.nextInvocation().toString()
        item.scheduled = true
      })
  }  
}

export { CollectorJobCore };
