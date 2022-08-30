import { castArray } from 'lodash';
import { Cache, BaseGw } from 'mdo-backend-tools';
import { scheduledJobs, Job} from 'node-schedule';

class CollectorJobGw extends BaseGw {
  private tableName = 'collector_job';
  private entityName = 'CollectorJob';

  constructor(props) {
    super(props);

    this.setLoader(
      new Cache({
        table: this.tableName,
        idField: 'id',
        db: this.getDb(),
        keyPrefix: this.tableName,
      }),
    );
  }

  async list(args) {
    const { params, pagination } = args || {};
    const { keyword, id } = params || {};
    const { limit, offset, sortBy }: any = this.getDb()?.createLimitOffsetSortBy(pagination, [
      { name: 'id', order: 'asc' },
    ]);

    const query = this.getDb()?.getBuilder(this.tableName).select('id').orderBy(sortBy);
    if (!isNaN(limit) && limit > 0) {
      query.offset(offset).limit(limit);
    }

    if (keyword) {
      query.whereRaw(`name ILIKE ?`, `%${keyword}%`);
    }

    if (id) {
      query.whereIn('id', castArray(id));
    }

    const items = await query;
    return await this.getMany(items.map((row) => row.id));
  }

  async create(args) {
    const { params } = args || {};

    if (!params) {
      throw new Error(`No "params" received to create ${this.entityName} record(s)`);
    }

    const objects = castArray(params);

    const items = await this.getDb()?.getBuilder(this.tableName).insert(objects).returning(['*']);
    return items;
  }

  async update(args) {
    const { where, params } = args || {};
    const { id } = where || {};

    if (!params) {
      throw new Error(`No "params" received to update ${this.entityName} record(s)`);
    }

    if (!where) {
      throw new Error(`No "where" received to create ${this.entityName} record(s)`);
    }

    const query = this.getDb()
      ?.getBuilder(this.tableName)
      .update({ ...params, updatedAt: this.getDh().dbUtcNow() })
      .where({ id })
      .returning(['*']);

    const upd = await query;

    upd.forEach((item) => this.getLoader().clear(item.id));

    return upd;
  }

  async remove(args) {
    const { where, params, hardRemove } = args || {};
    const { id } = where || {};

    if (!where) {
      throw new Error(`No "where" received to remove ${this.entityName} record(s)`);
    }

    let query = this.getDb()?.getBuilder(this.tableName).whereIn('id', castArray(id));

    if (hardRemove) {
      query = query.delete(['id']);
    } else {
      query = query
        .update({
          ...(params || {}),
          removedAt: this.getDh().dbUtcNow(),
        })
        .returning(['id']);
    }

    const upd = await query;

    upd.forEach((updItem) => this.getLoader().clear(updItem.id));

    return upd;
  }

  // async getMany(ids: string[]) {
  //   const collectorJobs: Job[] = Object.keys(scheduledJobs)
  //   collectorJobs.map( job => {
  //     id: job.name,
  //     name: job.name,
  //     collector: null,
  //     running: true,
  //     scheduled: true,
  //     nextInvocationTime: job.nextInvocation(),
  //     fireTime: null
  //   })

  //}
} 

export { CollectorJobGw };
