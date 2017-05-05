/*
 * Smart Bus
 *     --Paul
 * Bug collections:
 *  -1 date time wrong gramar
 *  -2 ip auto selector
 *  -3  
 */
var datetime = require('./datetime');
var express  = require('express');
var app      = express();
var http     = require('http').Server(app);
var io       = require('socket.io')(http);
var net      = require('net');
var host     = '192.168.1.110';
var port     = 6969;
var mysql    = require('mysql');

//global variable
var light =""
var temp = "";
var hum = "";
var uvi = "";
var uvinten= "";
var pm25 = "";
var atten= 0;
var meditate= 0;
var blink= "";
var dire = ""; // direction
var heartr = "";
var date = datetime.date;
var time = datetime.time;

/* Receive data from 7688 by net module */
net.createServer(function(socket){
  console.log("connecting: "+ socket.remoteAddress + ":" + socket.remotePort);
  socket.on('data', function(data){
    try{
      var jobj = JSON.parse(data.toString());
      var sensor = jobj.sensor;
    }catch(e){
      console.log(e);
    }

    switch(sensor){
      case "Light":
        light = jobj.data;//Intensity of light (0~100 %)
	console.log('light: '+light);///
        break;
      case "Temp":
        temp = jobj.data;//Temperature  (15~85 C)
        console.log('temp: '+temp);///
        break;
      case "Hum":
        hum = jobj.data;//Humidity  (0~100 %)
        console.log('hum: '+hum);///
        break;
      case "PM2.5":
        pm25 = jobj.data;//PM2.5  (0~11 UVI)
        console.log('pm2.5: '+pm25);///
        break;
      case "Atten":
        atten = jobj.data;//Attention  (0~200 \)
        console.log('attention: '+atten);///
        break;
      case "Meditate":
        meditate = jobj.data;// Meditation  (0~200 \)
        console.log('meditation: '+meditate);///
        break;
      case "Blink":
        blink = jobj.data;// BlinkStrength  (0~200 \)
        console.log('blinkStrength: '+blink);///
        break;
      case "UV":
        uvi = jobj.uvi;// UV Index  (0~13)
        uvinten = jobj.intensity;
        console.log('uvi: '+uvi);
        console.log('uv intensity: '+uvinten);
        break;
      case "Direction":
	dire = jobj.data;// straight left right
	console.log("Direction: "+dire);
	break;
      case "HeartRate":
	heartr = jobj.data;
	console.log("HeartRate: "+heartr);
	break;
      default:
        /* Default  code  */
    }

//      console.log("Client said: "+ jobj);//its client to server
      socket.write("Server said :"+data);//its server to client
  });

  socket.on('close', function(data){
    console.log("Client closed: " + socket.remoteAddress);
  });
}).listen(port,host);

/* page need */
app.use(express.static('Public'));

/* web page */
app.get("/", function(req , resp){
  resp.sendFile(__dirname +  '/index.html');
});

/* mysql connection */
var client  = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'demo_nodejs'
});
/*cnct.connect();
client.query('SELECT * FROM `first_table`', function(err, rows, fields){
    if(err) throw err;
});
client.end();*/


/*var a;
//write to json
client.query('select * from `Light`', function(err, rows, fields){
    if(err) throw err;

    a = JSON.stringify(rows);

    client.end();
});*/


/* socket.io to html */
io.on('connection', function(socket){
  setInterval(function(){
	
    socket.emit('data_emit', {
      light_value: light,
      temp_value: temp,
      hum_value: hum
    });
   
    console.log("emit loop");
  },5000);

  socket.on('get_data', function(data){
    /* client want some history data */
    var temp_json={};	
	
    client.query('select * from `Light`', function(err, rows, fields){
      if(err) throw err;

      temp_json = JSON.stringify(rows);
      console.log(temp_json);
      /* client.end(); */
	
      socket.emit('send_data',temp_json);
    });
  });

  socket.on('add user',function(msg){
    socket.username = msg;
    console.log("new user:"+msg+" logged.");
    io.emit('add user',{
      username: socket.username
    });
  });

  /* listening event */
  socket.on('chat message', function(msg){

    console.log(socket.username+":"+msg);

    /* release message */
    io.emit('chat message', {
      username:socket.username,
      msg:msg
    });
  });

  socket.on('disconnect',function(){
    console.log(socket.username+" left.");
    io.emit('user left',{
      username:socket.username
    });
  });
});

/* Customize the port you want default on port 3000 */
http.listen(process.env.PORT || 3000, function(){
  console.log("listing on : 3000");
});
