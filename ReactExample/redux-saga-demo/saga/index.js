import { put, take } from 'redux-saga/effects'

export function* rootSage() {
    for (let i = 0; i < 3; i++) {
        console.log(`等待${i}执行`)
        const action = yield take('ASYNC_ADD');
        console.log(action)
        yield put({ type: 'ADD' })
    }
    console.log('for 结束')
}