Object.prototype.extend = function (obj) {
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      this[i] = obj[i];
    }
  }
};