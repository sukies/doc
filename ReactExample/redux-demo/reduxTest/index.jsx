import React from 'react';
import { Provider, connect, createStore } from './redux';

const initStore = { user: { name: 'frank', age: 18 }, group: { name: 'group', age: 18 } };
const initReducre = (state, { type, payload }) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
    };
  } else {
    return state;
  }
};

const store = createStore(initReducre, initStore);

function App() {
  return (
    <Provider store={store}>
      <FirstNode />
      <SecondNode />
      <ThreeNode />
      <FouthNode />
    </Provider>
  );
}

const FirstNode = () => {
  console.log('first node 执行啦 ' + Math.random());
  return (
    <div style={{ border: '1px solid #999', margin: '16px', padding: '8px' }}>
      first
      <p>
        <User />
      </p>
    </div>
  );
};

const SecondNode = () => {
  console.log('Second node 执行啦 ' + Math.random());
  return (
    <div style={{ border: '1px solid #999', margin: '16px', padding: '8px' }}>
      Second
      <p>
        <UserModifier />
      </p>
    </div>
  );
};

const ThreeNode = connect(({ group }) => ({ group }))(({ group }) => {
  console.log('three node 执行啦 ' + Math.random());
  return (
    <div style={{ border: '1px solid #999', margin: '16px', padding: '8px' }}>
      three:
      <p>{group.name}</p>
    </div>
  );
});

const fetchUser = (dispatch) => {
  fetch('http://dev.alipay.net:9999/api/reduxText.json').then(async (response) => {
    const ret = await response.clone().json();
    console.log(ret);
    dispatch({ type: 'updateUser', payload: ret.data });
  });
};

const FouthNode = connect()(({ dispatch }) => {
  console.log('three node 执行啦 ' + Math.random());
  const onClick = () => {
    // 方式一
    // dispatch(fetchUser);
    // 方式2
    dispatch({ type: 'updateUser', payload: fetch('http://dev.alipay.net:9999/api/reduxText.json') });
  };
  return (
    <div style={{ border: '1px solid #999', margin: '16px', padding: '8px' }}>
      fouth:
      <p>
        <button onClick={onClick}>加载数据</button>
      </p>
    </div>
  );
});

const User = connect(({ user }) => ({ user }))(({ user }) => {
  console.log('User node 执行啦 ' + Math.random());
  return <span>User:{user.name}</span>;
});

const UserModifier = connect(
  ({ user }) => ({ user }),
  (dispatch) => ({
    updateUser: (attr) => dispatch({ type: 'updateUser', payload: attr }),
  })
)(({ user, updateUser }) => {
  console.log('UserModifier node 执行啦 ' + Math.random());
  const onChange = (e) => {
    updateUser({ name: e.target.value });
  };
  return <input value={user.name} onChange={onChange} />;
});

export default App;