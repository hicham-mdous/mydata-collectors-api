const core = 'collectorHealthCheckCore';

const resolvers = {
  Query: {
    collectorHealthCheck(parent, args, context) {
      return context[core].healthCheck(args);
    },
  },
};

export default resolvers;
