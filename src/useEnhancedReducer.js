import React, { useReducer } from 'react';

const useEnhancedReducer = function useEnhancedReducer(
  reducer,
  initialState = {},
  middlewares = [],
) {
  const [state, originalDispatch] = useReducer(reducer, initialState);

  const store = {
    dispatch: originalDispatch,
    getState: () => state,
  };

  const launchMiddlewares = (action, index) => {
    let next = state;

    if (middlewares[index]) {
      next = launchMiddlewares(action, index + 1);
    } else {
      return () => originalDispatch(action);
    }

    return middlewares[index](store)(next)(action);
  };

  const dispatch = action => {
    if (middlewares.length === 0) {
      return originalDispatch(action);
    }

    return launchMiddlewares(action, 0);
  };

  return [state, dispatch];
};

export default useEnhancedReducer;
