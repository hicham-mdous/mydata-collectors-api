import { RESULT_CODES } from 'mdo-backend-tools';

const core = 'collectorJobCore';

const resolvers = {
  Query: {
    collectorJobList(parent, args, context) {
      console.log('collectorJobList')
      return context[core].list(args);
    },
    collectorJobGet(parent, args, context) {
      return context[core].get(args);
    },
    collectorJobGetMany(parent, args, context) {
      return context[core].getMany(args);
    },
  },
  Mutation: {
    collectorJobCreate(parent, args, context) {
      return context[core].create(args);
    },
    collectorJobUpdate(parent, args, context) {
      return context[core].update(args);
    },
    collectorJobRemove(parent, args, context) {
      return context[core].remove(args);
    },
    collectorJobRemoveMany(parent, args, context) {
      return context[core].removeMany(args);
    },
    collectorJobSchedule(parent, args, context) {
      return context[core].collectorJobSchedule(args);
    },
    collectorJobCancel(parent, args, context) {
      return context[core].collectorJobCancel(args);
    },
  },
  collectorJob: {
    async collector(parent, args, context) {
      const { collectorId } = parent || {};

      if (!collectorId) {
        return null;
      }

      const result = await context[core].get({ id: collectorId });

      return result.code === RESULT_CODES.OK && result.data && result.data[0] ? result.data[0] : null;
    },
    // The "__resolveReference" function allows the "collector" type to be references from other microservices.
    async __resolveReference(reference, context) {
      if (!reference.id) {
        return null;
      }

      const result = await context[core].get({ id: reference.id });

      if (result && result.code === RESULT_CODES.OK) {
        return result.data && result.data[0];
      }

      return null;
    },
  },
};

export default resolvers;
