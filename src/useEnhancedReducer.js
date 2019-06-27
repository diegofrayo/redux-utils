import React from 'react';

const useEnhancedReducer = function useEnhancedReducer(
  reducer,
  initialState = {},
  middlewares = [],
) {
  const [state, originalDispatch] = React.useReducer(reducer, initialState);
  const cleanedMiddlewares = middlewares.filter(middleware => {
    return typeof middleware === 'function';
  });

  const store = {
    dispatch: originalDispatch,
    getState: () => state,
  };

  const launchMiddlewares = (action, index) => {
    if (cleanedMiddlewares[index]) {
      launchMiddlewares(action, index + 1);
    } else {
      return originalDispatch(action);
    }

    return cleanedMiddlewares[index](store)(() => {})(action);
  };

  const dispatch = action => {
    if (cleanedMiddlewares.length === 0) {
      return originalDispatch(action);
    }

    return launchMiddlewares(action, 0);
  };

  return [state, dispatch];
};

export default useEnhancedReducer;
