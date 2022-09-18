import { BaseCore } from 'mdo-backend-tools';

import { logger } from '../utils/logger';
import { CollectorJobGw, CollectorEcsGw, CollectorGw } from '../gateways';
import {
  validateGetByTextId,
  validateGetMany,
  validateRemoveByTextId,
  validateRemoveMany,
} from './validators/commonRules';

import { validateList, validateCreate, validateUpdate } from './validators/collectorValidators';
import { scheduledJobs, Job} from 'node-schedule';
import { getNetworkConfiguration, getOverrides } from 'utils'
import { mydataSettings, COLLECTOR_PENDING, COLLECTOR_RUNNING } from '../boundary';

class CollectorJobCore extends BaseCore {
  private collectorJobGw: CollectorJobGw;
  private collectorGw: CollectorGw;
  private collectorEcsGw: CollectorEcsGw
  private networkConfiguration

  constructor(props) {
    super(props);

    //this.setNeedAuth(true);

    this.collectorJobGw = new CollectorJobGw({ db: this.getDb(), ...props });
    this.collectorGw = new CollectorGw({ db: this.getDb(), ...props });
    this.collectorEcsGw = new CollectorEcsGw({});
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
      doingWhat: 'listing CollectorJobs',
      hasTransaction: false,
    });
  }

  async get(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};
        logger.debug('Request to get a CollectorJob', args);

        const [checkResult] = await validateGetByTextId(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const item = this.collectorJobGw.get(id);

        return this.send(item ? [item] : []);
      },
      doingWhat: 'getting a CollectorJob',
      hasTransaction: false,
    });
  }

  async getMany(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { id } = args || {};

        logger.debug('Request to multiple CollectorJobs', args);

        const [checkResult] = await validateGetMany(args);

        if (checkResult !== true) {
          return this.sendValidationFailure(checkResult);
        }

        const items = await this.collectorJobGw.getMany(id);

        return this.send(items);
      },
      doingWhat: 'getting multiple CollectorJobs',
      hasTransaction: false,
    });
  }

  async create(args) {
    return await this.runAction({
      args,
      handler: async (args) => {
        const { params } = args || {};

        logger.debug('Request to create a CollectorJob', args);

        const items = await this.collectorJobGw.create({params});
        //this.scheduleAll({ items })
        //this.collectorEcsGw.run({});

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

  async collectorJobSchedule(args) {
    logger.debug('collectorJobSchedule',args)
    const networkConfiguration =  await getNetworkConfiguration()
    const collectorJobs = await this.collectorJobGw.list(args);
    const collectors = await this.collectorGw.list({});
    collectorJobs.forEach( collectorJob => {
      const collector = collectors.filter( collector => collector.id == collectorJob.collectorId).shift()
      this.scheduleSingleCollectorJob({collectorJob,collector,networkConfiguration})
    })
  }

  async collectorJobCancel(args) {
    const { id } = args
    logger.debug('collectorJobCancel',args)
    const collectorJobs = await this.collectorJobGw.list(args);
    collectorJobs.forEach(collectorJob => {
      if(scheduledJobs[collectorJob.name]) {
          scheduledJobs[collectorJob.name].cancel()
      } else {
        logger.debug(collectorJob.name,'is already not scheduled!')
      }
    });

  }

  async scheduleAll() {
      logger.debug('sechduleAll collectorjobs')
      await this.collectorJobSchedule({})
  }
  

  async scheduleSingleCollectorJob(args) {
    let { id,collectorJob, collector, networkConfiguration } = args
     
    if( !collectorJob ) {
      collectorJob = await this.collectorJobGw.get(id);
    }

    if( !networkConfiguration ) {
        networkConfiguration =  await getNetworkConfiguration()
    }

    if( !collector ) {
      collector = await this.collectorGw.get(collectorJob.collectorId);
    }
    if( !this.isCollectorJobScheduled({collectorJob}) ) {
      const overrides = getOverrides({ cpu: collectorJob.cpu, memory: collectorJob.memory, collectorName:collector.name,type: collectorJob.type})
      const taskDefinition = `${mydataSettings.app}-${collectorJob.type}-${mydataSettings.service}-${mydataSettings.environment}-task`
      const params = {
        cluster: mydataSettings.cluster,
        group:`${collectorJob.type}:${collectorJob.name}`,
        startedBy: mydataSettings.collectorManager,
        count: 1,
        launchType: mydataSettings.launchType,
        networkConfiguration,
        overrides,
        taskDefinition
      }
      let job = new Job(collectorJob.name, async() => await this.runCollectorJob({params,collectorJob}))
      job.schedule(collectorJob.cron)
      this.collectorJobGw.update({params:{ scheduled:true }, where:{ id: collectorJob.id } }) 
    } else {
      logger.debug(collectorJob.name,'already scheduled!')
    }
  }
  
  async runCollectorJob(args) {
    let { collectorJob } = args
    try {
      collectorJob = this.enrichJobs({items:[collectorJob]}).shift()
      if(! await this.isCollectorJobAboutToRun(args)) {
        logger.debug(collectorJob.name,'is about to run now')
        collectorJob.running = COLLECTOR_PENDING
        await this.updateCollectorJob({ collectorJob })
        const data = await this.collectorEcsGw.runEcsTask(args)
      } 
      else {
          logger.debug(collectorJob.name,'is already running or about to run! skip this time')
      }

    } catch( error ) {

    }
  } 

  async updateCollectorJob(args) {
    const { collectorJob } = args
    const { running, lastInvocationTime, nextInvocationTime } = collectorJob
    await this.collectorJobGw.update({params:{ running , lastInvocationTime, nextInvocationTime }, where:{ id: collectorJob.id } })
  }

  async isCollectorJobAboutToRun(args) {
    let { collectorJob } = args
    collectorJob = await this.collectorJobGw.get(collectorJob);
    return collectorJob.running === COLLECTOR_PENDING || collectorJob.running === COLLECTOR_RUNNING
  }

  isCollectorJobScheduled(args) {
  const { collectorJob } = args
  if(scheduledJobs[collectorJob.name]) return true
  return false

  }

  enrichJobs(args) {
    let { items } = args
    let enrichedItems = items.map( item => {
      let job = scheduledJobs[item.name]
      item.running = job['running']
      item.scheduled = false
      item.lastInvocationTime = item.nextInvocationTime
      item.nextInvocationTime = job.nextInvocation().toISOString()
      return item;
    })
    return enrichedItems
  }

}

export { CollectorJobCore };
