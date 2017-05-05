var socketio = io();
$(document).ready(function(){
  //streaming setting

  socketio.on('Light_emit', function(data){
    var light = data.Light;
    light+="%";+
    $("#light_bar").css('width', light);
    $("#light_bar").text(light);
  });
  socketio.on('Temp_emit', function(data){
    var temp = data.Temp;
    $('#temp_bar').css('width', temp+"%");
    $('#temp_bar').text(temp+" C");
    if(temp>=24 && temp<=28)
      $('#temp_bar').attr('class', 'progress-bar progress-bar-success');
    else if(temp>28 && temp<=35)
      $('#temp_bar').attr('class', 'progress-bar progress-bar-warning');
    else if(temp > 35)
      $('#temp_bar').attr('class', 'progress-bar progress-bar-danger');
    else if(temp<24)
      $('#temp_bar').attr('class', 'progress-bar progress-bar-info');
  });
  socketio.on('Hum_emit', function(data) {
    var hum = data.Hum;
    $('#hum_bar').css('width', hum+"%");
    $('#hum_bar').text(hum+" %");
    if(hum>=45 && hum <=65)
      $('#hum_bar').attr('class', 'progress-bar progress-bar-success');
    else
      $('#hum_bar').attr('class', 'progress-bar progress-bar-warning');
  });
  socketio.on('PM_emit', function(data) {
    var pm25 = data.PM;
    var t = (pm25/150)*100;
    t=parseInt(pm25);
    $('#pm25_bar').css('width', t+'%');
    $('#pm25_bar').text(pm25+' μg/m3');
    if(pm25<=50)
      $('#pm25_bar').attr('class', 'progress-bar progress-bar-success');
    else if(pm25<=150)
      $('#pm25_bar').attr('class', 'progress-bar progress-bar-warning');
    else if(pm25 > 150)
      $('#pm25_bar').attr('class', 'progress-bar progress-bar-danger');
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
    if(uvi<=2)
      $('#uvi_bar').attr('class', 'progress-bar progress-bar-success');
    else if(pm25<=5)
      $('#uvi_bar').attr('class', 'progress-bar progress-bar-warning');
    else if(pm25 > 5)
      $('#uvi_bar').attr('class', 'progress-bar progress-bar-danger');
    console.log('uvi: '+uvi);
  });
  socketio.on('Direction_emit', function(data) {
    var dire = data.Direction;
    console.log('Direction: '+dire);
    switch(dire){
      case 'right':
        $('#left_video').css({ display: "none" });
        $('#right_video').css({ display: "block" });
        var temp = $('#right_video').position().top;
        temp = temp * 0.95;
        $('html, body').animate({
          scrollTop : temp
        }, 600 );
        break;
      case 'left':
        $('#left_video').css({ display: "block" });
        $('#right_video').css({ display: "none" });
        var temp = $('#left_video').position().top;
        temp = temp * 0.95;
        $('html, body').animate({
          scrollTop : temp
        }, 600 );
        break;
      case 'straight':
        $('#left_video').css({ display: "none" });
        $('#right_video').css({ display: "none" });
        var temp = $('#straight_view').position().top;
        temp = temp * 1.1 ;
        $('html, body').animate({
          scrollTop : temp
        }, 600 );
        break;
      default:
      /* default */
    }
  });
  socketio.on('HeartRate_emit', function(data) {
  var heartr = data.HeartRate;
  var hearts = data.HeartStatus;
  switch (hearts) {
    case 'detecting':
      $('#HeartRateInfo').text('心跳...偵測中');
      var tempstatus = $('#heartbeat_bar').text();
      if(tempstatus == '請戴上心跳感測器')
        $('#heartbeat_bar').text('心跳感測器偵測中');
      break;
    case 'restart':
      $('#HeartRateInfo').text('心跳');
      $('#heartbeat_bar').css('width', '100%');
      $('#heartbeat_bar').text('請戴上心跳感測器');
      $('#heartbeat_bar').attr('class', 'progress-bar');
      break;
    case 'success':
      var hrr = (heartr / 140)*100 ;
      hrr = parseInt(hrr);
      $('#heartbeat_bar').css('width', hrr+'%');
      $('#heartbeat_bar').text(heartr+'/ 分鐘');
      if(heartr > 65 && heartr < 85)
        $('#heartbeat_bar').attr('class', 'progress-bar progress-bar-success');
      else if(heartr >= 85 && heartr <= 100)
        $('#heartbeat_bar').attr('class', 'progress-bar progress-bar-warning');
      else if(heartr >= 50 && heartr <= 65)
        $('#heartbeat_bar').attr('class', 'progress-bar progress-bar-warning');
      else
        $('#heartbeat_bar').attr('class', 'progress-bar progress-bar-danger');
      break;
    default:
      /* default code */
  }console.log('HeartRate: '+heartr);
  });
});

