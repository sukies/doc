import React, { useState, useEffect } from 'react';

// 上下文，用于在任何地方读取store
const AppContext = React.createContext(null);
export const Provider = ({ store, children }) => <AppContext.Provider value={store}>{children}</AppContext.Provider>;

let state = undefined;
const setState = (newState) => {
  state = newState;
  listeners.map((fn) => fn(state));
};
let reducer = undefined;
const listeners = [];

const store = {
  getState: () => state,
  dispatch: (action) => {
    setState(reducer(state, action));
  },
  subscribe(fn) {
    listeners.push(fn);
    return () => {
      const index = listeners.indexOf(fn);
      listeners.splice(index, 1);
    };
  },
};

let dispatch = store.dispatch;

const prevDispatch = dispatch;

dispatch = (action) => {
  if (action instanceof Function) {
    //  对应方式一
    action(dispatch);
  } else {
    prevDispatch(action);
  }
};

const prevDispatch2 = dispatch;
dispatch = (action) => {
  if (action.payload instanceof Promise) {
    //  对应方式二
    action.payload.then(async (response) => {
      const ret = await response.clone().json();
      console.log(ret);
      dispatch({ ...action, payload: ret.data });
    });
  } else {
    prevDispatch2(action);
  }
};


// 判断使用到的state是否有更改
const changed = (oldState, newState) => {
  let isChanged = false;
  for (let key in oldState) {
    if (oldState[key] !== newState[key]) {
      isChanged = true;
    }
  }
  return isChanged;
};

/**
 * 高阶组件：让组件与全局状态链接起来
 * @param {function} mapStateToProps // 读staet
 * @param {function} mapDispatchToProps // 写state
 * @returns
 */
export const connect = (mapStateToProps, mapDispatchToProps) => (Component) => {
  // 规范dispatch流程
  return (props) => {
    // 用于更新组件
    const [, update] = useState({});

    const data = mapStateToProps ? mapStateToProps(state) : { state };
    const dispatchs = mapDispatchToProps ? mapDispatchToProps(dispatch) : { dispatch };
    // 精准渲染
    useEffect(
      () =>
        store.subscribe(() => {
          // 最新的state
          const newData = mapStateToProps ? mapStateToProps(state) : { state };
          if (changed(data, newData)) {
            update({});
          }
        }),
      [mapStateToProps]
    );

    return <Component {...dispatchs} {...data} {...props} />;
  };
};

// 创建store
export const createStore = (initReducer, initState) => {
    state = initState;
    reducer = initReducer;
    return store;
  };