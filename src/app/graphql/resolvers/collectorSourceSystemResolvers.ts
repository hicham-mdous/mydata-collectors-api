import { RESULT_CODES } from 'mdo-backend-tools';
const core = 'collectorSourceSystemCore';

const resolvers = {
  Query: {
    collectorSourceSystemList(parent, args, context) {
      return context[core].list(args);
    },
    collectorSourceSystemGet(parent, args, context) {
      return context[core].get(args);
    },
    collectorSourceSystemGetMany(parent, args, context) {
      return context[core].getMany(args);
    },
  },
  Mutation: {
    collectorSourceSystemCreate(parent, args, context) {
      return context[core].create(args);
    },
    collectorSourceSystemUpdate(parent, args, context) {
      return context[core].update(args);
    },
    collectorSourceSystemRemove(parent, args, context) {
      return context[core].remove(args);
    },
    collectorSourceSystemRemoveMany(parent, args, context) {
      return context[core].removeMany(args);
    },
  },
  collectorSourceSystem: {
    async collectors(parent, args, context) {
      const { id } = parent || {};

      if (!id) {
        return [];
      }

      const result = await context['collectorCore'].list({ params: { collectorSourceSystemId: id }, pagination: { pageSize: 2 } });

      return result.code === RESULT_CODES.OK ? result.data : [];
    },
    // The "__resolveReference" function allows the "collectorSourceSystem" type to be references from other microservices
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
