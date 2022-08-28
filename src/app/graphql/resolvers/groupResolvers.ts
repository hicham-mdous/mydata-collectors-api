import { RESULT_CODES } from 'mdo-backend-tools';
const core = 'groupCore';

const resolvers = {
  Query: {
    groupList(parent, args, context) {
      return context[core].list(args);
    },
    groupGet(parent, args, context) {
      return context[core].get(args);
    },
    groupGetMany(parent, args, context) {
      return context[core].getMany(args);
    },
  },
  Mutation: {
    groupCreate(parent, args, context) {
      return context[core].create(args);
    },
    groupUpdate(parent, args, context) {
      return context[core].update(args);
    },
    groupRemove(parent, args, context) {
      return context[core].remove(args);
    },
    groupRemoveMany(parent, args, context) {
      return context[core].removeMany(args);
    },
  },
  Group: {
    userCreated(parent /*, args, context */) {
      return { __typename: 'User', id: parent.createdBy };
    },
    userUpdated(parent /*, args, context */) {
      return { __typename: 'User', id: parent.updatedBy };
    },
    async notes(parent, args, context) {
      const { id } = parent || {};

      if (!id) {
        return [];
      }

      const result = await context['noteCore'].list({ params: { groupId: id }, pagination: { pageSize: 2 } });

      return result.code === RESULT_CODES.OK ? result.data : [];
    },
    // The "__resolveReference" function allows the "Group" type to be references from other microservices
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
