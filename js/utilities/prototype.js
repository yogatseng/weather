Object.prototype.extend = function (obj) {
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      this[i] = obj[i];
    }
  }
};

Object.prototype.toList = function (action) {
  const result = [];
  Object.keys(this).forEach(key => {
    let data;
    if (typeof action === "function") data = action(this[key], key);
    result.push(data);
  });
  return result;
};

Object.prototype.toMap = function (action) {
  const result = {};
  Object.keys(this).forEach(key => {
    let data;
    if (typeof action === "function") data = action(this[key], key);
    result[key] = data;
  });
  return result;
};