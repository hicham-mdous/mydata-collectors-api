import { BaseCore, DateTimeHelpers } from 'mdo-backend-tools';

import { logger } from '../utils/logger';
import pck from '../../package.json';

/**
 * There must be a core class that responds to health checks.
 * Name of class must have suffix `MicroserviceCore` and have one method `health`
 * The `health` method must return current date and version number
 */
class CollectorHealthCheckCore extends BaseCore {
  private dh = new DateTimeHelpers();

  constructor(props) {
    super(props);
    this.setNeedAuth(false);
  }

  async healthCheck(args) {
    return this.runAction({
      args,
      handler: async (args) => {
        logger.log(`Request for the Collectors microservice health check`, args);

        return this.send([
          {
            date: this.dh.dbFormat(new Date(), { dateOnly: false }),
            version: pck.version,
          },
        ]);
      },
      doingWhat: 'checking the Collectors microservice health',
      hasTransaction: false,
    });
  }
}

export { CollectorHealthCheckCore };
