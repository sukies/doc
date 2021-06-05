// 区分是否首次调用
let isMount = true;
// 保存当前正在处理的hook，指针
let workInProgressHook = null;

const fiber = {
    // 对应组件本身
    stateNode: App,
    /**
     * 保存useSate、this.state的数据
     * 保存内容是一个链表，因为同一个组件中会有多个useState调用
     * 链表内容为每个hook的state
     */
    memoizedState: null,
};

function useState(initialState) {
    /**
     * hook为当前正在处理中的hook
     * 生成单向链表，并获取当前处理的hook
     */
    let hook;
    if (isMount) {
        hook = {
            memoizedState: initialState,
            // 指向下一个useState
            next: null,
            queue: {
                // 保存接下来可能会进行的某些状态的改变
                pending: null,
            },
        };
        if (!fiber.memoizedState) {
            // 初次渲染的第一个useState
            fiber.memoizedState = hook;
        } else {
            // 初次渲染的第二个及以后的useState
            workInProgressHook.next = hook;
        }
        // 更新指针
        workInProgressHook = hook;
    } else {
        // 更新时已存在链表，直接获取
        hook = workInProgressHook;
        workInProgressHook = workInProgressHook.next;
    }

    /**
     * 计算新的state
     */
    // 基础state，即上一次状态
    let baseState = hook.memoizedState;
    if (hook.queue.pending) {
        /**
         * 本次更新有新的update，新的updata需要被执行
         */
        // 找到第一个update
        let firstUpdate = hook.queue.pending.next;
        do {
            // 遍历，
            // state1=action1(state0)->state2=action2(state1)->或者最终的state
            const action = firstUpdate.action;
            baseState = action(baseState);
            firstUpdate = firstUpdate.next;
            console.log(baseState)
        } while (firstUpdate !== hook.queue.pending.next); // 遍历到第一个节点时退出
        // 清空
        hook.queue.pending = null;
    }

    hook.memoizedState = baseState;
    return [baseState, dispatchAction.bind(null, hook.queue)];
}

/**
 * @param {function} action updateNum的入参：(num) => num + 1
 */
function dispatchAction(queue, action) {
    /**
     * update也是链表，是环状链表
     */
    const update = {
        action,
        next: null,
    };

    if (queue.pending === null) {
        // 当前的hook还没有需要触发的更新，即第一次更新
        // u0 -> u0 -> u0
        update.next = update;
    } else {
        // 多次调用，除了第一次，后面都会进入这个逻辑，onClick里面的第二次updateNum会进入这个逻辑
        // u1 -> u0 -> u1
        /**
         * queue.pending保存的是最后一个update
         * queue.pending.next保存的是第一个update
         */
        // 第一步u1 -> u0
        update.next = queue.pending.next;
        // 第二步u0 -> u1
        queue.pending.next = update;
    }
    // 每次执行dispatchAction,就把queue.pending赋值为最后一个节点
    queue.pending = update;

    // 触发更新
    schedule();
}

// 调度，每次组件更新都会触发调度方法
function schedule() {
    // 每次更新都初始一下，指向第一个
    workInProgressHook = fiber.memoizedState;
    const app = fiber.stateNode();
    isMount = false;
    return app;
}

function App() {
    // 单向链表保存
    const [num, updateNum] = useState(0);
    const [num1, updateNum1] = useState(0);

    console.log('isMount?', isMount);
    console.log('num:', num);
    console.log('num1:', num1);

    return {
        onClick() {
            // 环状单向链表保存
            updateNum((num) => num + 1);
            updateNum((num) => num + 10);
        },
        onClick2() {
            updateNum1((num) => num + 100);
        },
    };
}

window.app = schedule();