var fetch = require('node-fetch');
var level3;
var level4;
var localeNum = '';
var localeUrlStr = '';
var lat = 22.756227;
var lng = 121.082366;
var tMap = [
  { "location": "台東縣","number": "10014" },
  { "location": "花蓮縣","number": "10015" },
  { "location": "宜蘭縣","number": "10012" },
  { "location": "屏東縣","number": "10013" },
  { "location": "嘉義縣","number": "10010" },
  { "location": "雲林縣","number": "10009" },
  { "location": "南投縣","number": "10008" },
  { "location": "彰化縣","number": "10007" },
  { "location": "苗栗縣","number": "10005" },
  { "location": "新竹縣","number": "10004" },
  { "location": "新竹市","number": "10018" },
  { "location": "基隆市","number": "10017" },
  { "location": "高雄市","number": "64" },
  { "location": "台南市","number": "67" },
  { "location": "台中市","number": "66" },
  { "location": "桃園市","number": "68" },
  { "location": "新北市","number": "65" },
  { "location": "台北市","number": "63" }
]


var mapstr = 'http://maps.google.com/maps/api/geocode/json?latlng='+lat+','+lng+'&language=zh-TW';

/* fetch locale name */
fetch(mapstr)
  .then(function(res) {
    return res.json();
  }).then(function(json) {
    //console.log(json);
    level3 = json.results[0].address_components[3].long_name;
    //console.log(json.results[0].address_components[3].long_name);
    level4 = json.results[0].address_components[4].long_name;
    //console.log(json.results[0].address_components[4].long_name);
    for(var i in tMap) {
      if(tMap[i].location == level3 || tMap[i].location == level4) {
	localeNum = tMap[i].number;
	localeUrlStr = 'http://www.cwb.gov.tw//V7/forecast/taiwan/Data/W50_'+localeNum+'.txt';
	break;
      }
    }
    /* fetch weather data */
    if(localeUrlStr !== '') {
      fetch(localeUrlStr)
        .then(function(res) {
	  return res.text();
        }).then(function(body) {
	  var str = body.trim();
	  console.log(str);
	});
    }
  });
