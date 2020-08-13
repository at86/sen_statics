var format = function (bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + "MB";
};
function mem_to_str(mem) {
  return {
    heapTotal: format(mem.heapTotal),
    heapUsed: format(mem.heapUsed),
    rss: format(mem.rss),
  };
}
function statics() {
  var mem = process.memoryUsage();
  this.memPre = mem;
  this.history = {};
  this.beginMem = mem_to_str(mem);
}
statics.prototype.show = function (his) {
  var t = Date.now();
  var mem = process.memoryUsage();
  his.push({
    rss: mem.rss - this.memPre.rss,
    heapTotal: mem.heapTotal - this.memPre.heapTotal,
    heapUsed: mem.heapUsed - this.memPre.heapUsed,
    time: t - this.datePre,
  });
  // console.log("==>: heapTotal:" + format(mem.heapTotal - this.memPre.heapTotal) +
  //   ",\t\theapUsed:" + format(mem.heapUsed - this.memPre.heapUsed) +
  //   ",\t\trss:" + format(mem.rss - this.memPre.rss) +
  //   ",\t\ttime:" + (t - this.datePre) + 'ms');
};
statics.prototype.begin = function () {
  this.memPre = process.memoryUsage();
  this.datePre = Date.now();
};
statics.prototype.register = function (funcArr, runTimes, showRtnData) {
  for (let i = 0; i < runTimes; i++) {
    let rtn = {};
    funcArr.forEach((f, idx) => {
      if (!this.history['func_' + idx]) {
        this.history['func_' + idx] = [];
      }
      this.begin();
      let d = f();
      this.show(this.history['func_' + idx]);
      showRtnData && (rtn['func_' + idx] = d);
    });
    showRtnData && console.log('==============>return data of times ' + (i + 1));
    showRtnData && console.table(rtn);
  }
  let mmA = {};
  Object.keys(this.history).forEach(k => {
    let arr = this.history[k];
    let minMaxAve = {};
    let totalObj = {};
    arr.forEach((r, idx) => {
      Object.keys(r).forEach(kk => {
        if (totalObj[kk] === undefined) {
          totalObj[kk] = 0;
        }
        totalObj[kk] += r[kk];

        if (minMaxAve['min_' + kk] === undefined || minMaxAve['min_' + kk] > r[kk]) {
          minMaxAve['min_' + kk] = r[kk];
        }
        if (minMaxAve['max_' + kk] === undefined || minMaxAve['max_' + kk] < r[kk]) {
          minMaxAve['max_' + kk] = r[kk];
        }
        minMaxAve['average_' + kk] = totalObj[kk] / (idx + 1);
      });
    });
    const ordered = {};
    Object.keys(minMaxAve).sort().forEach(function (key) {
      if (!key.includes('_time')) {
        ordered[key] = format(minMaxAve[key]);
      }
      else {
        ordered[key] = minMaxAve[key] + 'ms';
      }
    });
    mmA[k] = ordered;
  });
  console.log('==============> peformance info table:');
  console.table(get_key(mmA, 'max_'));
  console.table(get_key(mmA, 'average_'));
  console.table(get_key(mmA, 'min_'));

  console.log('==============> memory info table:');
  let memInfo = {
    beigin: this.beginMem,
    end: mem_to_str(process.memoryUsage()),
  };
  console.table(memInfo);
};

function get_key(obj, key) {
  let obj2 = {};
  Object.keys(obj).forEach(k1 => {
    obj2[k1] = {};
    Object.keys(obj[k1]).forEach(k2 => {
      if (k2.includes(key)) {
        obj2[k1][k2] = obj[k1][k2];
      }
    });
  });
  return obj2;
}

module.exports = statics;
