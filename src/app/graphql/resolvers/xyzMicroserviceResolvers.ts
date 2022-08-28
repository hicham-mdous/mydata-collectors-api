const core = 'xyzMicroserviceCore';

const resolvers = {
  Query: {
    xyzMicroserviceHealth(parent, args, context) {
      return context[core].health(args);
    },
  },
};

export default resolvers;
