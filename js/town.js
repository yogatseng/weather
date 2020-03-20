class Country {
  constructor(id, name, towns) {
    this.id = id;
    this.towns = towns;
    this.name = name;
  }

  set id(id) {
    this._id = id;
  }
  get id() {
    return this._id;
  }

  set name(name) {
    let nameStr = name.replace("台", "臺") + "縣";
    switch (name) {
      case "基隆":
      case "台北":
      case "新北":
      case "桃園":
      case "台中":
      case "台南":
      case "高雄":
        nameStr = nameStr.replace("縣", "市");
        break;
      case "新竹":
      case "嘉義":
        if (this.towns.length === 2 || this.towns.length === 3)
          nameStr = nameStr.replace("縣", "市");
        break;
    }
    this._name = nameStr;
  }
  get name() {
    return this._name;
  }
}

class Town {
  constructor(id, name) {
    this.id = id;
    this.name = name;

    this.dataApi = new Grab(`https://works.ioa.tw/weather/api/towns/${this.id}.json`);
    this.weatherApi = new Grab(`https://works.ioa.tw/weather/api/weathers/${this.id}.json`);
  }

  set id(id) {
    this._id = id;
  }
  get id() {
    return this._id;
  }

  set name(name) {
    this._name = name;
  }
  get name() {
    return this._name;
  }

  set postal(postal) {
    this._postal = postal;
  }
  get postal() {
    return this._postal;
  }

  set weather(weather) {
    this._weather = weather;
  }
  get weather() {
    return this._weather;
  }

  setData(data) {
    this.postal = data.postal;
    this.position = data.position;
  }

  setCountry(country) {
    this.countryId = country.id;
    this.countryName = country.name;
  }
}