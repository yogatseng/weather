class Grab {
  constructor(url, type) {
    this.request = new XMLHttpRequest();
    this.type = type || "GET";
    this.url = url;
  }

  set type(type) {
    this._type = type;
  }
  get type() {
    return this._type;
  }

  set url(url) {
    this._url = url;
  }
  get url() {
    return this._url;
  }

  getAPIData() {
    const grab = this;
    return new Promise((resolve, reject) => {
      grab.request.open(grab.type, grab.url, true);
      grab.request.onload = function () {
        resolve(JSON.parse(grab.request.responseText));
      };
      grab.request.send();
    });
  }
}