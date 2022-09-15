import appSettings from '../appSettings';
const environment = appSettings.environment.toLowerCase()
const app = 'mydata'
const service = 'collector'
export const mydataSettings = {
  vpcName: `${app}-${environment}-vpc`,
  securityGroupName: `${app}-${service}-${environment}-sg`,
  cluster: `${app}-${service}-${environment}-cluster`,
  collectorManager: `${app}-${service}-manager`,
  launchType: 'FARGATE',
  assignPublicIp: 'DISABLED',
  app,
  service,
  environment
};

export const COLLECTOR_STOPPED = 0
export const COLLECTOR_RUNNING = 1
export const COLLECTOR_PENDING = 2