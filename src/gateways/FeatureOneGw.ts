import { logger } from '../utils/logger';

class FeatureOneGw {
  constructor(props) {
    //logger.log(`Do FeatureOneGw initialization with props: `, props);
  }

  async run(args) {
    logger.log(`Do some useful stuff here with args: `, args);
    return args;
  }
}

export { FeatureOneGw };
