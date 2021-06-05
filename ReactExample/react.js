// 下一个工作单元
let nextUnitOfWork = null;
// 我们提交给DOM的最后一个fiber
let currentRoot = null;
// 根节点，用于全局渲染
let wipRoot = null;
// 数组，跟踪要删除的节点
let deletions = null;

// function component使用到，当前的fiber
let wipFiber = null;
// 当前的钩子索引
let hookIndex = null;

// 判断属性是否为事件名称
const isEvent = (key) => key.startsWith('on');
// 判断属性不是事件，也不是children
const isProperty = (key) => key !== 'children' && !isEvent(key);
// 判断是否为新属性
const isNew = (prev, next) => (key) => prev[key] !== next[key];
// 判断属性是否被删除
const isGone = (prev, next) => (key) => !(key in next);

/**
 * 添加文本属性
 * @param {string} text
 * @returns
 */
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

/**
 * 创建对应的fiber节点
 * @param {string|object} type
 * @param {object} props
 * @param  {...any} children
 * @returns
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => (typeof child === 'object' ? child : createTextElement(child))),
    },
  };
}

/**
 * 创建新的dom节点，调用updateDom，对dom节点添加属性和监听事件，返回添加完属性的dom
 * @param {object} fiber
 * @returns
 */
function createDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}

/**
 * 更新Dom节点的属性、事件
 * @param {Dom} dom
 * @param {object} prevProps
 * @param {object} nextProps
 */
function updateDom(dom, prevProps, nextProps) {
  // 删除旧的、改变的监听事件
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 删除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // 设置新的、改变的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // 添加新的监听事件
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
// ====================================================================
/**
 * 删除dom，因为存在功能组件，要兼容，需要一直递归到存在dom的节点再去删除
 * @param {*} fiber
 * @param {*} domParent
 */
function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

/**
 * 当前fiber节点的变更
 * @param {object} fiber
 * @returns
 */
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  // 找到最近的存在dom节点的父节点
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  // 根据effectTag进行对应的处理
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
  }
  // 先递归子节点
  commitWork(fiber.child);
  // 再递归兄弟节点
  commitWork(fiber.sibling);
}

/**
 * 执行工作区间
 */
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function useState(initial) {
  const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

/**
 * 旧纤维与新元素进行协调
 * 1.如果旧的光纤和新的元素具有相同的类型，我们可以保留DOM节点并仅使用新的道具进行更新
 * 2.如果类型不同并且有一个新元素，则意味着我们需要创建一个新的DOM节点
 * 3.如果类型不同且有旧光纤，则需要删除旧节点
 * @param {object} wipFiber 当前的fiber
 * @param {array} elements fiber的children
 */
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  // 旧的fiber
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  /** 为每个孩子创建新的fiber */
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    // 类型相同
    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      // update the node 如果旧的光纤和新的元素具有相同的类型，我们可以保留DOM节点并仅使用新的道具进行更新
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }
    if (element && !sameType) {
      // add this node 如果类型不同并且有一个新元素，则意味着我们需要创建一个新的DOM节点
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }
    if (oldFiber && !sameType) {
      // delete the oldFiber's node 如果类型不同且有旧光纤，则需要删除旧节点
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      // 如果是第一个元素，那么设置当前fiber的child是newFiber
      wipFiber.child = newFiber;
    } else if (element) {
      // 如果不是，那么设置上一个fiber的sibling是当前元素
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

/**
 * function Component，fiber没有DOM节点，children来自运行该功能，而不是直接从props获取
 * @param {object} fiber
 */
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  // 支持useState在同一组件中多次调用
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

/**
 * 正常的节点，除function外
 * @param {object} fiber
 */
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

/**
 * 工作单元：
 * 1.将元素添加到DOM
 * 2.为元素的子代创建纤维
 * 3.选择下一个工作单元
 * @param {*} fiber
 * @returns 返回下一个工作单元
 */
function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // 如果当前节点没有兄弟元素，那么查找叔叔的兄弟节点
    nextFiber = nextFiber.parent;
  }
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

/**
 * 工作单元，我们把工作分解成几个小单元，在完成每个单元后，如果需要执行其他任何操作，我们将让浏览器中断渲染。
 * @param {time} deadline
 */
function workLoop(deadline) {
  // 是否需要先执行（高优先级任务）
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 如果没有下一个工作单元，并且有根的fiber，就进入渲染阶段
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

/** React不再使用requestIdleCallback了。现在，它使用调度程序包。但是对于此用例，它在概念上是相同的。 */
requestIdleCallback(workLoop);

const Didact = {
  createElement,
  render,
  useState,
};

/** @jsx Didact.createElement */
function Counter() {
  const [state, setState] = Didact.useState(1);
  return (<h1 onClick={() => setState((c) => c + 1)}>Count: {state}</h1>);
}
const element = (
  <div>
    <Counter />
    <span>333</span>
  </div>
);
console.log(element);
const container = document.getElementById('root');
Didact.render(element, container);