const { isFunction } = require('loadsh');

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

let count = 1;
/**
 * Pending Fulfilled Rejected
 */
class MyPromise {
  constructor(handle) {
    if (!isFunction(handle)) {
      throw new Error('MyPromise must accept a function as a parameter');
    }

    this.status = PENDING;
    this.value = undefined;
    this.count = count++;

    // 成功回调队列
    this._fulffilledQueues = [];
    // 失败回调队列
    this._rejectedQueues = [];

    try {
      handle(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }
  _resolve = function (ret) {
    console.log(`this.count: ${this.count},fulffilledList length:${this._fulffilledQueues.length},rejectedList length:${this._rejectedQueues.length}, _resolve`);
    const run = () => {
      // console.log(this.value, ret, this);
      if (this.status !== PENDING) {
        return;
      }
      // 依次执行成功队列中的函数，并清空队列
      const runFulfilled = (value) => {
        let cb;
        while ((cb = this._fulffilledQueues.shift())) {
          cb(value);
        }
      };
      // 依次执行失败队列中的函数，并清空队列
      const runRejected = (error) => {
        let cb;
        while ((cb = this._rejectedQueues.shift())) {
          cb(error);
        }
      };
      /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
        当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
      */
      if (ret instanceof MyPromise) {
        ret.then(
          (value) => {
            console.log(this.value, value);
            this.value = value;
            this.status = FULFILLED;
            runFulfilled(value);
          },
          (error) => {
            console.log(this.value, error);
            this.value = error;
            this.status = REJECTED;
            runRejected(error);
          }
        );
      } else {
        // console.log(this.value, ret);
        this.status = FULFILLED;
        this.value = ret;
        runFulfilled(ret);
      }
    };
    setTimeout(() => run(), 0);
  };

  _reject = function (ret) {
    console.log(`this.count: ${this.count},fulffilledList length:${this._fulffilledQueues.length},rejectedList length:${this._rejectedQueues.length}, _reject`);
    // console.log('_reject', ret, this.status);
    if (this.status !== PENDING) {
      return;
    }

    const run = () => {
      // console.log('_reject', ret, this._rejectedQueues);
      this.status = REJECTED;
      this.value = ret;
      let cb;
      while ((cb = this._rejectedQueues.shift())) {
        cb(ret);
      }
    };
    setTimeout(() => run(), 0);
  };

  then = function (onFulfilled, onRejected) {
    const that = this;
    console.log(`this.count: ${this.count},fulffilledList length:${this._fulffilledQueues.length},rejectedList length:${this._rejectedQueues.length}, then`);
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      console.log(`this.count: ${this.count},fulffilledList length:${this._fulffilledQueues.length},rejectedList length:${this._rejectedQueues.length}, then return new`);
      let fulfilled = (value) => {
        try {
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value);
          } else {
            let res = onFulfilled(value);
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              onFulfilledNext(res);
            }
          }
        } catch (err) {
          onRejectedNext(err);
        }
      };
      let rejected = (value) => {
        // console.log(this.status);
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(value);
          } else {
            let res = onRejected(value);
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext);
            } else {
              onRejectedNext(value);
            }
          }
        } catch (err) {
          onRejectedNext(err);
        }
      };
      switch (this.status) {
        case PENDING:
          this._fulffilledQueues.push(fulfilled);
          this._rejectedQueues.push(rejected);
          break;
        case FULFILLED:
          fulfilled(this.value);
          break;
        case REJECTED:
          rejected(this.value);
          break;
      }
    });
  };
  catch(err) {
    return this.then(undefined, err);
  }

  static resolve(val) {
    if (val instanceof MyPromise) {
      return val;
    }
    return new Promise((resolve) => resolve(val));
  }

  static reject(val) {
    return new MyPromise((resolve, reject) => reject(val));
  }

  finally(cb) {
    return this.then(
      (val) => MyPromise.resolve(cb()).then(() => val),
      (reson) =>
        MyPromise.resolve(cb()).then(() => {
          throw reson;
        })
    );
  }

  // 添加静态all方法
  static all(list) {
    return new MyPromise((resolve, reject) => {
      /**
       * 返回值的集合
       */
      let values = [];
      let count = 0;
      for (let [i, p] of list.entries()) {
        // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
        this.resolve(p).then(
          (res) => {
            values[i] = res;
            count++;
            // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
            if (count === list.length) resolve(values);
          },
          (err) => {
            // 有一个被rejected时返回的MyPromise状态就变成rejected
            reject(err);
          }
        );
      }
    });
  }
  // // 添加静态race方法
  // static race(list) {
  //   return new MyPromise((resolve, reject) => {
  //     for (let p of list) {
  //       // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
  //       this.resolve(p).then(
  //         (res) => {
  //           resolve(res);
  //         },
  //         (err) => {
  //           reject(err);
  //         }
  //       );
  //     }
  //   });
  // }
}
let promise1 = new MyPromise((resolve, reject) => {
  setTimeout(() => { resolve('fail'); }, 1000);
});

let promise2 = promise1.then(
  (res) => {
    console.log(res);
    const promise4 = new MyPromise((resolve, reject) => {
      setTimeout(() => resolve(1111122233456), 1000);
    });

    const promise5 = promise4.then(
      (res) => { console.log(res,); },
      (err) => { console.log(err); }
    );

    return promise5;
  },
  (err) => {
    console.log(err);
    return '这里的onRejected本来是一个函数，但现在不是';
  }
);

const promise3 = promise2.then(
  (res) => { console.log(res); },
  (err) => { console.log(err); }
);
// const promise1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve({ success: true });
//   }, 1000);
// });

// console.log('promise1:', promise1);
// console.log(
//   'promise1 then',
//   promise1.then((ret) => {
//     console.log(chalk.green('promise1 then:'), ret, '\n');
//   })
// );
//   .catch((ret) => {
//     console.log(chalk.red('promise1 catch:'), ret, '\n');
//   })
//   .finally(() => {
//     console.log(chalk.blue('promise1 finally !'), '\n');
//   });

// const promise2 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject({ success: false });
//   }, 1000);
// });
// promise2
//   .then((ret) => {
//     console.log(chalk.green('promise2 then:'), ret, '\n');
//   })
//   .catch((ret) => {
//     console.log(chalk.red('promise2 catch:'), ret, '\n');
//   })
//   .finally(() => {
//     console.log(chalk.blue('promise2 finally !'), '\n');
//   });