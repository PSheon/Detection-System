$(document).ready(function(){
  // add click attribute
  $("ul.nav li").on("click", function(){

    if(!$(this).hasClass("acctive")){

      $("ul.nav li[class='active']").removeClass("active");
      $(this).addClass("active");
    }
  });

  // scroll page
  $("ul.nav li a").on("click", function(){

    var a_elm = $(this);
    var target_id = a_elm.attr("href");
    // console.log(target_id);
    var topTo = 0;

    if(target_id != "#"){
      topTo = $(target_id).position().top;
    }

    $("html, body").animate({
      scrollTop : topTo
    }, 600 , function(){

      $("ul.nav li[class='active']").removeClass("active");
      a_elm.parent().addClass("active");
    });
    return false;
  });

  //scrolling with frontpage
  var window_last_scroll_top = $(window).scrollTop();
  var scroll_direction = '';
  var bg_y = [];

  $("div.fix_bg").each(function(i){
    bg_y[i] = 50;
  });

  $(window).on("scroll", function(){

    var window_top = $(this).scrollTop();
    var window_height = $(this).height();
    var window_bottom = window_top + window_height;
    var current_top = $(this).scrollTop();

    if(current_top > window_last_scroll_top){
      scroll_direction = 'down';
    }else{
      scroll_direction = 'up';
    }

    window_last_scroll_top = current_top;

    $("div.fix_bg").each(function(i){

      var bg_top = $(this).position().top;
      var bg_height = $(this).height();
      var bg_bottom = bg_top + bg_height;
      var is_out = (window_top > bg_bottom) || (window_bottom < bg_top);

      if(!is_out){

	if(scroll_direction == 'down'){
	  $(this).css("background-position", "50%" + (bg_y[i] += 1) + "%");

	}else if(scroll_direction == 'up'){
	  $(this).css("background-position", "50%" + (bg_y[i] -= 1) + "%");
	}
      }
    });
  });

  // scrooling icon show
  $(window).on("scroll", function(){

    // var current_height = 0;//46 1400 2480
    var current_height = $(this).scrollTop();
    if(current_height <= 46){
      $("ul.nav li[class='active']").removeClass("active");
      $("#envi_top").addClass("active");
    }else if(current_height > 1280 && current_height <= 2200){
      $("ul.nav li[class='active']").removeClass("active");
      $("#video_top").addClass("active");
    }else if(current_height > 2200){
      $("ul.nav li[class='active']").removeClass("active");
      $("#globe_top").addClass("active");
    }
  });

  //logo click
  $("#logo_top").on("click", function(){
    $("html, body").animate({
      scrollTop : 40
    }, 600 );
  });
});
