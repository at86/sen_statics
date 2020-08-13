A function for record run time and memory usage.

`npm install sen_statics`

## var stMemTime = new statics();

## stMemTime.register([func1,func2,..], runTimes, showRtnData)

## a demo

```javascript

const statics = require('sen_statics');

function gen_data(len) {
  let arr = new Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = parseInt(Math.random() * len + 1, 10);
  }
  let p1 = parseInt(Math.random() * len + 1, 10);
  let p2;
  do {
    p2 = parseInt(Math.random() * len + 1, 10);
    if (p2 !== p1) {
      break;
    }
  } while (true);
  let sum = arr[p1] + arr[p2];
  return {arr, sum};
}

var stMemTime = new statics();

let genData = gen_data(1000000);
let nums = genData.arr, target = genData.sum;
console.log('two num sum is:', target);

let w_hash = () => {
  let obj = {};
  for (let i = 0; i < nums.length; i++) {
    if (obj[nums[i]] !== undefined) {
      let p1Idx = obj[nums[i]];
      return {
        p1: {
          idx: p1Idx, val: nums[p1Idx],
        },
        p2: {
          idx: i, val: nums[i],
        },
      };
    }
    else {
      let n = target - nums[i];
      obj[n] = i;
    }
  }
};

let w_iterate = () => {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return {
          p1: {
            idx: i, val: nums[i],
          },
          p2: {
            idx: j, val: nums[j],
          },
        };
      }
    }
  }
};

stMemTime.register([
  w_hash,
  w_iterate,
], 10, false);

```
