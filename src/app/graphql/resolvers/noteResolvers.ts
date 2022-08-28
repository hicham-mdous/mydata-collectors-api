import { RESULT_CODES } from 'mdo-backend-tools';

const core = 'noteCore';

const resolvers = {
  Query: {
    noteList(parent, args, context) {
      return context[core].list(args);
    },
    noteGet(parent, args, context) {
      return context[core].get(args);
    },
    noteGetMany(parent, args, context) {
      return context[core].getMany(args);
    },
  },
  Mutation: {
    noteCreate(parent, args, context) {
      return context[core].create(args);
    },
    noteUpdate(parent, args, context) {
      return context[core].update(args);
    },
    noteRemove(parent, args, context) {
      return context[core].remove(args);
    },
    noteRemoveMany(parent, args, context) {
      return context[core].removeMany(args);
    },
  },
  Note: {
    userCreated(parent /*, args, context */) {
      return { __typename: 'User', id: parent.createdBy };
    },
    userUpdated(parent /*, args, context */) {
      return { __typename: 'User', id: parent.updatedBy };
    },
    async group(parent, args, context) {
      const { groupId } = parent || {};

      if (!groupId) {
        return null;
      }

      const result = await context['groupCore'].get({ id: groupId });

      return result.code === RESULT_CODES.OK && result.data && result.data[0] ? result.data[0] : null;
    },
    // The "__resolveReference" function allows the "Note" type to be references from other microservices.
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
