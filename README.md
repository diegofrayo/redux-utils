# redux-utils

## Description

Enhanced useReducer hook and a redux-duck implementation



## Usage

### useEnhancedReducer

This hook receives as parameters three arguments: a `reducer` function, an `initialState` object and an optional `middlewares` array. This hook is compatible with `redux` middlewares API. You can use existent redux middlewares like `redux-logger` or `redux-thunk`, or even you can create your own [middlewares](https://redux.js.org/advanced/middleware).

```
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { useEnhancedReducer } from '@diegofrayo/redux-utils';

const reducer = () => {};
const initialState = {};

const myHook = (enableLogging) => {
  const middlewares = [enableLogging && logger, thunk];
  const [state, dispatch] = useEnhancedReducer(
    reducer,
    initialState,
    middlewares,
  );

  const myAction1 = () => {
    dispatch({ type: 'MyAction' });
  };

  const myAction2 = payload => {
    dispatch({ type: 'MyAction', payload });
  };

  return {
    ...state,

    myAction1,
    myAction2,
  };
};
```


### duck

Utility function to create `reducers/action types/actions` following this [redux-duck](https://github.com/erikras/ducks-modular-redux) proposal. You can use this function if you are using either `redux` library or `useReducer` or `useEnhancedReducer` hook.

```
// my-reducer.js

import { duck } from '@diegofrayo/redux-utils';

const myDuck = duck.create('my-duck');

// --- INITIAL STATE ---
const initialState = {};

// --- ACTION TYPES ---
const ActionTypes = myDuck.defineTypes([
  'MY_ACTION_TYPE_1',
  'MY_ACTION_TYPE_2',
]);

console.log(ActionTypes);
// { MY_ACTION_TYPE_1: 'my-duck/MY_ACTION_TYPE_1', MY_ACTION_TYPE_2: 'my-duck/MY_ACTION_TYPE_2', }

const MY_ACTION_TYPE_3 = myDuck.defineType('MY_ACTION_TYPE_3');

console.log(MY_ACTION_TYPE_3);
// 'my-duck/MY_ACTION_TYPE_3'

// --- REDUCER HANDLERS ---
const reducerHandlers = {
  [ActionTypes.MY_ACTION_TYPE_1]: (state, payload) => {
    return { ...state, name: payload.userName };
  },

  ...duck.mergeActions({
    types: [
      ActionTypes.MY_ACTION_TYPE_2,
      MY_ACTION_TYPE_3,
    ],
    handler: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  }),

  // this handler is optional, it could be defined when you use
  // useReducer or useEnhancedReducer hook. Don't use for Redux
  default: (state, action) => {
    throw new Error(`Invalid action: ${action.type}`);
  },
};

// --- REDUCER ---
const reducer = myDuck.createReducer(reducerHandlers, initialState);

export default reducer;

export {
  ActionTypes,
};
```

So, now you can use this reducer either in:

- **redux**
  ```
  import { applyMiddleware, createStore, combineReducers } from 'redux';
  import logger from 'redux-logger';

  import myReducer from './my-reducer';

  const store = createStore(
    combineReducers({
      myReducer,
    }),
    {},
    applyMiddleware(logger),
  );

  export default store;
  ```

- **useReducer** or **useEnhancedReducer**
  ```
  import logger from 'redux-logger';
  import thunk from 'redux-thunk';
  import { useEnhancedReducer } from '@diegofrayo/redux-utils';

  import reducer, { ActionTypes } from 'my-reducer';

  const initialState = {};

  const myHook = (enableLogging) => {
    const middlewares = [enableLogging && logger, thunk];
    const [state, dispatch] = useEnhancedReducer(
      reducer,
      initialState,
      middlewares,
    );

    const myAction1 = () => {
      dispatch({ type: ActionTypes.MY_ACTION_TYPE_1, payload: { userName: 'Carl' } });
    };

    const myAction2 = payload => {
      dispatch({ type: ActionTypes.MY_ACTION_TYPE_2, payload });
    };

    return {
      ...state,

      myAction1,
      myAction2,
    };
  };
  ```
