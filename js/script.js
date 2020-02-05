// 參考API網址：https://works.ioa.tw/weather/api/doc/index.html#api-Weather_API

function getAPIData(url, type) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(type || "GET", url, true);
    request.onload = function () {
      resolve(JSON.parse(request.responseText));
    }
    request.send();
  });
}

const getCountrys = () => {
  return getAPIData("https://works.ioa.tw/weather/api/all.json");
}

const getTownsData = (town) => {
  return getAPIData(`https://works.ioa.tw/weather/api/towns/${town}.json`);
}
const getTownsWeather = (town) => {
  return getAPIData(`https://works.ioa.tw/weather/api/weathers/${town}.json`);
}

async function getAllTownsDataByCountryData(allTowns, cb, name) {
  for (let countryIndex = 0; countryIndex < allTowns.length; countryIndex++) {
    const country = allTowns[countryIndex];
    for (let townIndex = 0; townIndex < country.towns.length; townIndex++) {
      const town = country.towns[townIndex];
      const towndata = await cb(town.id);
      if (!town[name]) town[name] = {}
      town[name].extend(towndata);
    }
  }
  return allTowns;
}

getCountrys().then(allTowns => {
  const country = JSON.parse(JSON.stringify(allTowns));
  getAllTownsDataByCountryData(country, getTownsData, 'data').then(data => {
    console.log(data);
  });
  const schedule = new Schedule("test")
  schedule.freqMillisecond = 100000
  schedule.action = function () {
    getAllTownsDataByCountryData(country, getTownsWeather, 'weather').then(data => {
      console.log(data);
    });
  }
  schedule.start();
})