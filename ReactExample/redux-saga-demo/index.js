import React from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootSage } from './saga';

const initStore = { number: 0 };
const initReducre = (state, { type, payload }) => {
    switch (type) {
        case 'ADD':
            return {
                ...state,
                number: state.number + 1,
            };
        default:
            return state
    }
};

let sagaMiddleware = createSagaMiddleware();

const store = applyMiddleware(sagaMiddleware)(createStore)(initReducre, initStore);
sagaMiddleware.run(rootSage);

const FouthNode = connect(({ number }) => ({ number }))(({ dispatch, number }) => {
    const onClick = () => {
        dispatch({ type: 'ASYNC_ADD' });
    };
    return (
        <div style={{ border: '1px solid #999', margin: '16px', padding: '8px' }}>
            number:{number}
            <p>
                <button onClick={onClick}>加载数据</button>
            </p>
        </div>
    );
});

function App() {
    return (
        <Provider store={store}>
            <FouthNode />
        </Provider>
    );
}

export default App;