import { RESULT_CODES } from 'mdo-backend-tools';

const core = 'collectorCore';

const resolvers = {
  Query: {
    collectorList(parent, args, context) {
      console.log('collectorList')
      return context[core].list(args);
    },
    collectorGet(parent, args, context) {
      return context[core].get(args);
    },
    collectorGetMany(parent, args, context) {
      return context[core].getMany(args);
    },
  },
  Mutation: {
    collectorCreate(parent, args, context) {
      return context[core].create(args);
    },
    collectorUpdate(parent, args, context) {
      return context[core].update(args);
    },
    collectorRemove(parent, args, context) {
      return context[core].remove(args);
    },
    collectorRemoveMany(parent, args, context) {
      return context[core].removeMany(args);
    },
  },
  collector: {
    async collectorSourceSystem(parent, args, context) {
      const { collectorSourceSystemId } = parent || {};

      if (!collectorSourceSystemId) {
        return null;
      }

      const result = await context['collectorSourceSystemCore'].get({ id: collectorSourceSystemId });

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
