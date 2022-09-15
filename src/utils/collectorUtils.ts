import { EC2, Subnet } from "@aws-sdk/client-ec2";
import appSettings from '../appSettings';
import { mydataSettings } from '../boundary';
const config = {
    region: appSettings.AwsRegion,
    AwsAccessKeyId: appSettings.AwsAccessKeyId,
    AwsSecretAccessKey: appSettings.AwsSecretAccessKey,
  }
const ec2 = new EC2(config)

export const getVpcId = async (vpcName) => {
  var params = {
      Filters: [
          {
              Name: "tag:Name",
              Values: [vpcName]
          }
      ]
  };
  const vpc = (await ec2.describeVpcs(params))
  return vpc.Vpcs?.shift()?.VpcId
};

export const  getPrivateSubnets = async (vpcId) => {
  var params = {
      Filters: [
          {
              Name: "vpc-id",
              Values: [vpcId]
          }
      ]
  };
  const subnets: Subnet[] = (await ec2.describeSubnets(params)).Subnets || [];
  return subnets.filter( subnet => !subnet.MapPublicIpOnLaunch)
                .map(subnet => subnet.SubnetId)
};

export const getSecurityGroup = async (securityGroupName) => {
  var params = {
    Filters: [
      {
        Name: "tag:Name", 
        Values: [ securityGroupName ]
      }
    ]
   };

  const sg = await ec2.describeSecurityGroups(params)
  return sg.SecurityGroups?.shift()?.GroupId
}

export const getNetworkConfiguration = async () => {
  const vpcId = await getVpcId(mydataSettings.vpcName)
  const privateSubnetIds = await getPrivateSubnets(vpcId)
  const securityGroupIds = await getSecurityGroup(mydataSettings.securityGroupName)
  const networkConfiguration =  {
        awsvpcConfiguration: { 
            assignPublicIp: mydataSettings.assignPublicIp,
            securityGroups: [securityGroupIds],
            subnets: privateSubnetIds
        }
  }

  return networkConfiguration
}

export const getOverrides = (args) => {
  const { cpu, memory, collectorName, type } = args
  const containerName = `${mydataSettings.app}-${type}-${mydataSettings.service}-${mydataSettings.environment}`
  const containerOverrides = [
          {
              name: containerName,
              environment: [
                  {
                      name: 'COLLECTOR_NAME',
                      value: collectorName
                  }
              ]
          }
      ]
  const overrides = {
          cpu: cpu,
          memory: memory,
          containerOverrides: containerOverrides
  }
  
  return overrides
}
