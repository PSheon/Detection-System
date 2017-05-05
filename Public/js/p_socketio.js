var socketio = io();
$(document).ready(function(){
  //streaming setting

  socketio.on('Temp_emit', function(data){
    var temp = data.Temp;
    $('#temp_bar').css('width', temp+"%");
    $('#temp_bar').text(temp+" °C");
    if(temp>=24 && temp<=28){
      $('#temp_bar').attr('class', 'progress-bar progress-bar-success');
      $('#temp_info').html('');
    }else if(temp>28 && temp<=35){
      $('#temp_bar').attr('class', 'progress-bar progress-bar-warning');
      $('#temp_info').html('車外氣溫稍高<br>請稍加留意！');
    }else if(temp > 35){
      $('#temp_bar').attr('class', 'progress-bar progress-bar-danger');
      $('#temp_info').html('車外氣候炎熱<br>請多加留意！');
    }else if(temp<24){
      $('#temp_bar').attr('class', 'progress-bar progress-bar-info');
      $('#temp_info').html('車外氣溫較低<br>請多加留意！');
    }
  });
  socketio.on('Hum_emit', function(data) {
    var hum = data.Hum;
    $('#hum_bar').css('width', hum+"%");
    $('#hum_bar').text(hum+" %");
    if(hum>=45 && hum <=65){
      $('#hum_bar').attr('class', 'progress-bar progress-bar-success');
      $('#hum_info').html('');
    }else if(hum<45){
      $('#hum_bar').attr('class', 'progress-bar progress-bar-warning');
      $('#hum_info').html('車外濕度較低<br>請注意保溼！');
    }else{
      $('#hum_bar').attr('class', 'progress-bar progress-bar-warning');
      $('#hum_info').html('車外濕度較高<br>請多加留意！');
    }
  });
  socketio.on('Alcohol_emit', function(data) {
    var alcohol = data.Alcohol;
    console.log('alcohol is :'+alcohol);
  });
  socketio.on('Temp_in_emit', function(data) {
    var tempIn = data.TempIn;
    tempIn = Math.round(tempIn);
    tempIn = parseInt(tempIn);
    if(tempIn > 0 && tempIn < 100) {
      $('#temp_in_bar').css('width', tempIn+"%");
      $('#temp_in_bar').text(tempIn+" °C");
      if(tempIn>=24 && tempIn<=28){
	$('#temp_in_bar').attr('class', 'progress-bar progress-bar-success');
        $('#temp_in_info').html('');
      }else if(tempIn>28 && tempIn<=35){
        $('#temp_in_bar').attr('class', 'progress-bar progress-bar-warning');
	$('#temp_in_info').html('車外氣溫稍高<br>請稍加留意！');
      }else if(tempIn > 35){
        $('#temp_in_bar').attr('class', 'progress-bar progress-bar-danger');
        $('#temp_in_info').html('車外氣候炎熱<br>請多加留意！');
      }else if(tempIn < 24){
        $('#temp_in_bar').attr('class', 'progress-bar progress-bar-info');
        $('#temp_in_info').html('車外氣溫較低<br>請多加留意！');
      } 
    }
    console.log('tempIn: '+tempIn);
  });
  socketio.on('Hum_in_emit', function(data) {
    var humIn = data.HumIn;
    console.log('humIn: '+humIn);
  });
  socketio.on('PM_emit', function(data) {
    var pm25 = data.PM;
    var t = (pm25/150)*100;
    t=parseInt(pm25);
    $('#pm25_bar').css('width', t+'%');
    $('#pm25_bar').text(pm25+' μg/m3');
    if(pm25<=50){
      $('#pm25_bar').attr('class', 'progress-bar progress-bar-success');
      $('#pm_info').html('');
    }else if(pm25<=150){
      $('#pm25_bar').attr('class', 'progress-bar progress-bar-warning');
      $('#pm_info').html('車外空氣粉塵微粒稍高<br>請稍微減少戶外活動！');
    }else if(pm25 > 150){
      $('#pm25_bar').attr('class', 'progress-bar progress-bar-danger');
      $('#pm_info').html('車外空氣粉塵微粒過高<br>請減少戶外活動！');
    }
    /*console.log('pm2.5 :'+pm25);*/
  });
  socketio.on('Atten_emit', function(data) {
    var atten = data.Atten;
    console.log('attention : '+atten);
  });
  socketio.on('Meditate_emit', function(data) {
    var meditate = data.Meditate;
    console.log('Meditate : '+meditate);
  });
  socketio.on('Blink_emit', function(data) {
    var blink = data.Blink;
    console.log('Blink : '+blink);
  });
  socketio.on('UV_emit', function(data) {
    var uvi = data.UVI;
    var t = (uvi/15)*100;
    t=parseInt(t);
    $('#uvi_bar').css('width', t+'%');
    $('#uvi_bar').text(uvi+' uvi');
    if(uvi<=2){
      $('#uvi_bar').attr('class', 'progress-bar progress-bar-success');
      $('#uv_info').html('');
    }else if(pm25<=5){
      $('#uvi_bar').attr('class', 'progress-bar progress-bar-warning');
      $('#uv_info').html('車外曝曬指數達中量級<br>請盡量待在陰處！');
    }else if(pm25 > 5){
      $('#uvi_bar').attr('class', 'progress-bar progress-bar-danger');
      $('#uv_info').html('車外曝曬指數達高量級<br>請待在陰處！');
    }
    console.log('uvi: '+uvi);
  });
  socketio.on('Direction_emit', function(data) {
    var dire = data.Direction;
    console.log('Direction: '+dire);
    switch(dire){
      case 'right':
        console.log('right');
        break;
      case 'left':
        console.log('left');
        break;
      case 'straight':
        console.log('straight');
      default:
      /* default */
    }
  });
  socketio.on('HeartRate_emit', function(data) {
  var heartr = data.HeartRate;
  var hearts = data.HeartStatus;
  switch (hearts) {
    case 'detecting':
      console.log('心跳...偵測中');
      break;
    case 'restart':
      console.log('請戴上心跳感測器');
      break;
    case 'success':
      console.log(heartr+'/ 分鐘');
      break;
    default:
      /* default code */
  }
  });
});
