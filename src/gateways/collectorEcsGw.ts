import { ECS,ECSClient, RunTaskCommand, waitUntilTasksRunning, waitUntilTasksStopped} from "@aws-sdk/client-ecs";
import { WaiterResult} from "@aws-sdk/util-waiter";
import { EC2 } from "@aws-sdk/client-ec2";
import appSettings from '../appSettings';
import { mydataSettings } from '../boundary'

class CollectorEcsGw  {
  private eC2: EC2
  private ecs: ECS
  private ecsClient: ECSClient
  constructor(props) {
    const config = {
      region: appSettings.AwsRegion,
      AwsAccessKeyId: appSettings.AwsAccessKeyId,
      AwsSecretAccessKey: appSettings.AwsSecretAccessKey,
    }
    this.eC2 = new EC2(config)
    this.ecs = new ECS(config)
    this.ecsClient = new ECSClient(config)
  }

  async runEcsTask(args) {
      const { params } = args
      var runTaskCommand = new RunTaskCommand(params)
      var ecsTask = await this.ecsClient.send(runTaskCommand)
      return ecsTask
  }

async waitUntilTasksRunning(args) :Promise<WaiterResult>  {
  const { cluster,taskArn } = args
  var waitECSTask = await waitUntilTasksRunning({"client": this.ecsClient, "maxWaitTime": 600, "maxDelay": 1, "minDelay": 1}, {"cluster": cluster, "tasks": [taskArn]})
  return waitECSTask
}

async waitUntilTasksStopped(args) :Promise<WaiterResult>  {
  const { cluster,taskArn } = args
  var waitECSTask = await waitUntilTasksStopped({"client": this.ecsClient, "maxWaitTime": 600, "maxDelay": 1, "minDelay": 1}, {"cluster": cluster, "tasks": [taskArn]})
  return waitECSTask
}

  async listEcsTasks(args) {
    const { cluster, startedBy } = args

    const params = {
      cluster,
      startedBy
    }
    const data = await this.ecs.listTasks(params)
    return data
}

async describeTask(args) {
  const { tasks,cluster } = args
  let data = {}
  if(tasks && tasks.length > 0 )
  data = await this.ecs.describeTasks({tasks,cluster})
  return data
}

} 

export { CollectorEcsGw };
