import { BaseCore } from 'mdo-backend-tools';

import { FeatureOneGw } from '../gateways';

class SomeFeatureCore extends BaseCore {
  private featureOneGw: FeatureOneGw;

  constructor(props) {
    super(props);
    this.setNeedAuth(false);
    this.featureOneGw = new FeatureOneGw(props);
  }

  /**
   * Each method that processes request from outside must use `this.runAction` function
   * @param args input args
   * @returns object of Result type
   */
  async runFeatureOne(args) {
    return this.runAction({
      args,
      handler: async (args) => {
        // run validations here
        const result = await this.featureOneGw.run(args);

        return this.send([result]);
      },
      doingWhat: 'sending an email',
      hasTransaction: false,
    });
  }
}

export { SomeFeatureCore };
