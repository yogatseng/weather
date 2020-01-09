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

const asyncRun = async () => {
  return await getAPIData("https://works.ioa.tw/weather/api/all.json");
}
asyncRun().then(allTowns => {
  console.log(allTowns);
  for (let i=0; i<allTowns.length; i++) {
    getTownsData(allTowns[i])
  }
}).catch(response => { // 有失敗的
  console.log(response);
})

function getTownsData(county) {
  const towns = Object.assign([], county.towns);
  const asyncRun = async () => {
    for (let i=0; i<towns.length; i++) {
      const towndata = await getAPIData(`https://works.ioa.tw/weather/api/towns/${towns[i].id}.json`);
      towns[i].extend(towndata);
    }
    return towns
  }
  asyncRun().then(allTowns => {
    return allTowns;
  })
}