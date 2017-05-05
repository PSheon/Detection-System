/*
 * Smart Bus
 *     --Paul
 * Bug collections:
 *  -1 Fixed
 *  -2 ip auto selector
 *  -3 
 */
//var datetime = require('./datetime');
var express    = require('express');
var app	       = express();
var http       = require('http').Server(app);
var io	       = require('socket.io')(http);
var net	       = require('net');
var host       = '192.168.1.104';
var port       = 6969;
var mysql      = require('mysql');
var calc       = require('./calcLevel');
  
/* global variable */
var light      = "";
var temp       = "";
var hum        = "";
var uv	       = "";
var pm25       = "";
var atten      = "";
var meditate   = "";
var blink      = "";
var dire       = ""; // direction
var heartr     = "";
var alcohol    = "";
var trans_ob   = "";/* temp object */
var latitude   = "";
var longitude  = "";
var locale     = "";

/* mysql connection */
var sqlclient  = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'demo_nodejs'
});

sqlclient.connect();
setInterval(function() {
  if(latitude == '' || longitude == '')  return;
  var date = new Date().toLocaleDateString();
  var time = new Date().toLocaleTimeString();
  if(temp !== ''){
    var querystr = 'INSERT INTO `Temp`(`value`,`date`,`time`,`latitude`,`longitude`) VALUES ('+temp+',"'+date+'","'+time+'","'+latitude+'","'+longitude+'");';
    sqlclient.query(querystr, function(err, rows, fields) { if(err) throw err; })
  }
  if(hum !== ''){
    var querystr = 'INSERT INTO `Hum`(`value`,`date`,`time`,`latitude`,`longitude`) VALUES ('+hum+',"'+date+'","'+time+'","'+latitude+'","'+longitude+'");';
    sqlclient.query(querystr, function(err, rows, fields) { if(err) throw err; })
  }
  if(uv !== ''){
    var querystr = 'INSERT INTO `UV`(`value`,`date`,`time`,`latitude`,`longitude`) VALUES ('+uv+',"'+date+'","'+time+'","'+latitude+'","'+longitude+'");';console.log(querystr);
    sqlclient.query(querystr, function(err, rows, fields) { if(err) throw err; })
  }
  if(pm25 !== ''){
    var querystr = 'INSERT INTO `PM2.5`(`value`,`date`,`time`,`latitude`,`longitude`) VALUES ('+pm25+',"'+date+'","'+time+'","'+latitude+'","'+longitude+'");';
    sqlclient.query(querystr, function(err, rows, fields) { if(err) throw err; })
  }
}, 3*60*1000);
/*sqlclient.end();*/

/* Receive data from 7688 by net module */
net.createServer(function(socket) {
  console.log("connecting: " + socket.remoteAddress + ":" + socket.remotePort);
  socket.on('data', function(data) {
    try{
      var jobj = JSON.parse(data.toString());
      var sensor = jobj.sensor;
    }catch(e){
      console.log(e);
    }/* log the received data */
    switch(sensor){
      case "Light":
	light = jobj.data;//Intensity of light (0~100 %)
        console.log('light: '+jobj.data);        break;
      case "Temp":
	temp = jobj.data;//Temperature  (15~85 C)
        console.log('temp: '+jobj.data);         break;
      case "Hum":
	hum = jobj.data;//Humidity  (0~100 %)
        console.log('hum: '+jobj.data);          break;
      case "Location":
	latitude = jobj.lat;
	longitude = jobj.long;
        console.log('latitude: '+jobj.lat);
        console.log('longitude: '+jobj.long);    break;
      case "PM25":
	pm25 = jobj.data;//PM2.5  (0~11 UVI)
        console.log('pm2.5: '+jobj.data);        break;
      case "Alcohol":
	alcohol = jobj.data;//Alcohol  (0.1~10 mg/L)
	console.log('alcohol is '+jobj.data);	 break;
      case "TempIn":
	tempIn = jobj.data;//temp in bus (C)
	console.log('temp in Bus: '+jobj.data);	 break;
      case "HumIn":
	humIn = jobj.data;//hum in bus (%)
	console.log('hun in bus: '+jobj.data);	 break;
      case "mylinkit2":
	if(trans_ob !== '') {
          socket.write(JSON.stringify(trans_ob));
          trans_ob = ''; 
        }					 break;
      case "Atten":
	atten = jobj.data;//Attention  (0~200 \)
        console.log('attention: '+jobj.data);    break;
      case "Meditate":
	meditate = jobj.data;// Meditation  (0~200 \)
        console.log('meditation: '+jobj.data);   break;
      case "Blink":
	blink = jobj.data;// BlinkStrength  (0~200 \)
        console.log('blinkStrength: '+jobj.data);break;
      case "UV":
	uv = parseInt(jobj.data);// UV Index  (0~13)
        console.log('uvi: '+jobj.data);          break;
      case "Direction":
	dire = jobj.data;// straight left right
        console.log("Direction: "+jobj.data);    break;
      case "HeartRate":
	heartr = jobj.data;
	hearts = jobj.status;
        console.log("HeartRate: "+jobj.data);
	console.log("HeartStatus: "+jobj.status);break;
      default:
        /* Default  code  */
    }/* socket.write("Server said :"+data);//its server to client */
  });
  io.on('connection', function(socketio) {
    socket.on('data', function(data) {
      try{
        var jobj = JSON.parse(data.toString());
        var sensor = jobj.sensor;
      }catch(e){
        console.log(e);
      }
      switch(sensor){
        case "Light":
          socketio.emit('Light_emit', { Light: jobj.data });
          break;
        case "Temp":
          socketio.emit('Temp_emit', { Temp: jobj.data });
          break;
        case "Hum":
          socketio.emit('Hum_emit', { Hum: jobj.data });
          break;
	case "Location":
	  socketio.emit('Location_emit', { Lat: jobj.lat, Long: jobj.long });
	  break;
	case "PM25":
          socketio.emit('PM_emit', { PM: jobj.data }); 
          break;
	case "Alcohol":
	  socketio.emit('Alcohol_emit', { Alcohol: jobj.data });
	  break;
	case "TempIn":
	  socketio.emit('Temp_in_emit', { TempIn: jobj.data });
	  break;
	case "HumIn":
          socketio.emit('Hum_in_emit', { HumIn: jobj.data }); 
          break;
        case "Atten":
          socketio.emit('Atten_emit', { Atten: jobj.data });
          break;
        case "Meditate":
          socketio.emit('Meditate_emit', { Meditate: jobj.data });
          break;
        case "Blink":
          socketio.emit('Blink_emit', { Blink: jobj.data });
          break;
        case "UV":
          socketio.emit('UV_emit', { UVI: jobj.data });
          break;
        case "Direction":
          socketio.emit('Direction_emit', { Direction: jobj.data });
          break;
        case "HeartRate":
          socketio.emit('HeartRate_emit', { HeartRate: jobj.data , HeartStatus: jobj.status });
          break;
        default:
          /* Default  code  */
      }/* socket.write("Server said :"+data);//its server to client */
    });
  });
  socket.on('close', function(data) {
    console.log("Client closed: " + socket.remoteAddress);
  });
}).listen(port, host);

/* Calculating envirnment&security level */
setInterval(function() {
  if(temp !== '' && hum !== '' && pm25 !== '' && uv !== '') {
    var e_level = calc.calcEnvLevel(temp, hum, pm25, uv);
    trans_ob = { "number": 2 , "data": e_level };
    temp='';hum='';pm25='';uv='';
    console.log('Envirnment Level is : '+trans_ob.number);
  }   
  if(atten !== '' && heartr !== '' && alcohol !== '') {
    var s_level = calc.calcSecLevel(atten, heartr, alcohol);
    console.log('Security Level is : '+s_level);
  }
},1000);

/* page need */
app.use(express.static('Public'));

/* driver web page */
app.get('/driver', function(req, resp) {
  resp.sendFile(__dirname + '/driver.html');
});

/* passenger web page */
app.get("/", function(req , resp){
  resp.sendFile(__dirname +  '/passenger.html');
});

/* socket.io to html */
// io.on('connection', function(socket) {
//
//   socket.on('get_data', function(data) {
//     //client want some history data
//     var temp_json = {};
//     client.query('select * from `Light`', function(err, rows, fields) {
//       if (err) throw err;
//       temp_json = JSON.stringify(rows);
//       console.log(temp_json);
//       //client.end();
//       socket.emit('send_data', temp_json);
//     });
//   });
//   socket.on('add user', function(msg) {
//     socket.username = msg;
//     console.log("new user:" + msg + " logged.");
//     io.emit('add user', {
//       username: socket.username
//     });
//   });
//   //listening event
//   socket.on('chat message', function(msg) {
//     console.log(socket.username + ":" + msg);
//     //release message
//     io.emit('chat message', {
//       username: socket.username,
//       msg: msg
//     });
//   });
//   socket.on('disconnect', function() {
//     console.log(socket.username + " left.");
//     io.emit('user left', {
//       username: socket.username
//     });
//   });
// });

http.listen(process.env.PORT || 3000, function() {
  console.log("listing on : 3000");
});

