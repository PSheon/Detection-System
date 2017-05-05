module.exports = {
  calcEnvLevel:function(temp, hum, pm25, uvi) {
    var e_total = 0;
    /* Temperature standard on 26'C */
    if(temp < 18 || temp >34) {
      e_total += Math.abs(temp - 26)*7;
    }else if(temp >=25 && temp <=27) {
    }else {
      e_total += Math.abs(temp - 26)*2;
    }
    /* Humidity standard on 50% */
    if(hum < 46) {
      e_total += (46-hum)*0.5;
    }else if(hum > 66) {
      e_total += (hum-66)*0.5;
    }
    /* PM2.5 should less than 35 */
    if(pm25 > 35) {
      if(pm25 < 55) {
	e_total += 10;
      }else if(pm25 < 70) {
	e_total += 15;
      }else {
	e_total += 30;
      }
    }
    /* UVI should less than 3 */
    if(uvi > 2) {
      if(uvi < 6) {
	e_total += 5;
      }else if(uvi < 8) {
	e_total += 15;
      }else if(uvi < 11) {
	e_total += 35;
      }else {
	e_total += 55;
      }
    }
    return e_total;   
  },
  calcSecLevel:function(atten, heartr, alcohol) {
    var s_total = 0;
    /* Alcohol must less than 0.15 mg/L */

    /* HeartRate : normal in 60~100*/
    if(heartr < 60) {
      s_total += 50;
    }else if(heartr > 100) {
      s_total += 65;
    }
    /* Attention : Mindwave */

    return s_total;
  }
};
