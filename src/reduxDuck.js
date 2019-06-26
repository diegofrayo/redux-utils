const create = function createDuck(name, app) {
  function defineType(type) {
    if (app) {
      return `${app}/${name}/${type}`;
    }

    return `${name}/${type}`;
  }

  function defineTypes(types) {
    return types.reduce((result, type) => {
      // eslint-disable-next-line no-param-reassign
      result[type] = defineType(type);

      return result;
    }, {});
  }

  function createAction(type) {
    return function actionCreator(payload) {
      const action = { type };

      if (payload) {
        action.payload = payload;
      }

      return action;
    };
  }

  function createReducer(cases, defaultState = {}) {
    return function reducer(state = defaultState, action = {}) {
      if (state === undefined) {
        return defaultState;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const caseName in cases) {
        if (action.type === caseName) {
          return cases[caseName](state, action);
        }
      }

      if (cases.default) {
        return cases.default(state, action);
      }

      return state;
    };
  }

  return {
    createAction,
    createReducer,
    defineType,
    defineTypes,
  };
};

const mergeActions = ({ types, handler }) => {
  return types.reduce((result, actionType) => {
    // eslint-disable-next-line no-param-reassign
    result[actionType] = handler;

    return result;
  }, {});
};

export default { create, mergeActions };
