
window.onload=function(){
  $('[data-toggle="tooltip"]').tooltip();
  var first_img=$('#section1 .img-wraper');
  var obj=new Image();
  obj.onerror = obj.onabort = function() {
    console.log('error');
  }
  obj.onload=function(){
    $('#load').hide();
    $('#menu').css({'opacity':1});


  	var h,w,myw,myh,desc,desc_imgs,desc_p,dataAnchor,
  			container=$('.container'),
  			sectionList=$('section'),
  			current=$('.current'),
  			logo=$('#logo'),
  			logoBox=$('.logoBox'),
  			menu=$('#menu li'),
  			index=0,
  			tag=true,
        t,d;
    $('.container').show();

    /********小贴士********/
    $("#tips").bind("start", function() {
      //console.log('start')
        var _ = this, 
        C = function() {
            $(_).find(".t_unit").each(function(A, _) {
                var C = $(this).children(), B = C.index($(this).find(".current"));
                C.eq(1 - B).css({"z-index": 1}).fadeIn(0, function() {
                    $(this).css({"z-index": 0}).addClass("current")
                });
                C.eq(B).removeClass("current").fadeOut(0)
            });
            $(_).data("timer", setTimeout(C, 1500))
        };
        $(_).data("timer", setTimeout(C, 1000)).css({display: "block"})
    }).bind("stop", function() {
        //console.log('stop');
        clearTimeout($(this).data("timer"));
        $(this).animate({'left':'-100%','opacity':'0'});
    });

  	/********调整********/
  	function set(){
  		h=$(window).height();
  		w=$(window).width();
      myw=screen.width;
      myh=screen.height;
  		//console.log(h);
      $('#tips').trigger("start");
      setTimeout(function(){
        $('#tips').trigger('stop');
      },8000);

      if(w>1000){
      	if(.2*w<=320){
      		$('#section1 .logoBox,#logo,#logo-ie8').css({
	          'height':.2*w,
	          'width':.2*w,
	          'margin-left':-.2*w/2,
	        });
	      }
        $('#section1 .logoBox,#logo,#logo-ie8').css({
          'top':.14*h
        });
        $('#section1 .desc').css({
          'top':.1*h+.2*w
        });
      }
  		$('body').css({"height":h,"overflow":"hidden"});
      if(w<myw-20||h<myh-150){
       $('[data-resize]').wanker({delay: 0, duration: 2000});
      
      }
      container.animate({"top":-(h*index)}, 500);
 	  }
  	set();

  	/********导航********/
  	menu.each(function(n){
  		$(this).click(function(){
  			if(!container.is(':animated') && !container.find('*').is(':animated')){
  				current=$('.current');
  				$(this).addClass('active').siblings().removeClass('active');
  				current.removeClass('current');
  				sectionList.eq(n).addClass('current');
  				container.animate({"top":-(h*n)}, 0,'swing');
  				index=n;
          // checkTop();
  				moving(index);
  			}
  		})
  	});
    function checkTop(){
      if(index==1){
        container.addClass('top');
      }else{
        container.removeClass('top');
      }

    }
  	function moving(index){
	    switch(index){
	      case 0:{
              section3MovingBack();
	          section2MovingBack();
	          section1MovingForward();
	          break;
	      }
        case 1:{
            section1MovingBack();
            section2MovingForward();
            section3MovingBack();
            break;
        }
	      case 2:{
	          section2MovingBack();
	          section3MovingForward();
	          section4MovingBack();
	          break;
	      }
	      case 3:{
	          section3MovingBack();
	          section4MovingForward();
	          break;
	      }
	    }
  	}
    function section1MovingForward(){
        $(".container #section1 .logoBox,#logo,.container #section1 .desc").stop(true,false).animate({'opacity':1}, 500);
        
    }
    function section1MovingBack(){
        $(".container #section1 .logoBox,#logo,.container #section1 .desc").stop(true,false).animate({'opacity':0}, 500);
        
    }
    function section2MovingForward(){
        $(".container #section2>*").stop(true,false).animate({'opacity':1}, 50);
        t=setInterval(change,4000);
    }
    function section2MovingBack(){
        $(".container #section2>*").stop(true,false).animate({'opacity':0}, 50);
        clearInterval(t);

    }
    function section3MovingForward(){
        $(".container #section3>*").stop(true,false).animate({'opacity':1}, 50);
        $('#menu li').addClass('colorB');
        $('#zc.carousel').carousel({
				  interval: 5000,
				  pause:'hover'
				});
    }
    function section3MovingBack(){
        $(".container #section3>*").stop(true,false).animate({'opacity':0}, 50);
        $('#menu li').removeClass('colorB');
        $('#zc.carousel').carousel('pause');

    }
    function section4MovingForward(){
    	tag=false;
      $(".container #section4 >*").stop(true,false).animate({'opacity':1}, 50);
      if(!$('#section4 #newsList .more').length){

        $('#section4 #newsList').append('<div class="row more"></div>');
        //加载新闻json数据
        $.ajax({
          url:'news.json',
	        dataType:"json",
          beforeSend:function(jqXHR,settings){
            $('#section4').find('.more').html('loading');
          },
          success:function(response,status,xhr){
            $('#section4').find('.more').html('');
            $('#section4').find('.inset_shadow').css({
              height:$('#section4 .content').height()
            });
            var json_news=response,
                num=8,
                page=Math.ceil(json_news.length/8),
                i=1,
					    	flag=false,
                newsIdx=0;

            loadNews(json_news.slice(0,num),num,i,newsIdx,flag);
	          var lastTop=parseFloat($('#newsCon').find('.col-xs-6').last().offset().top)-parseFloat($('#newsCon').height());

            $('#newsCon').scroll(function(){
              //console.log($(this).scrollTop()+'+'+lastTop)
              if(flag) {
                if(($('#newsCon').scrollTop()+$('#newsCon').height())==document.getElementsByClassName('content')[0].clientHeight) {
                  setTimeout(function(){
                    tag=true;
                  },1000)
                }
                return false;
              }
              if(($('#newsCon').scrollTop()+$('#newsCon').height())==document.getElementsByClassName('content')[0].clientHeight){
                flag=true;
                i++;
                loadNews(json_news.slice(num*(i-1),num*i),num,i,newsIdx,flag);
                flag=false;
                if(i==page) {
                  flag=true;
                  setTimeout(function(){
                    tag=true;
                  },1000)
                  
                }
              }
            })
          }
        });
      }
    }
    function section4MovingBack(){
    	tag=true;
    }
    function loadNews(json,num,i,newsIdx,flag){
      $.each(json,function(index,value){
        if(index%2===0&&index<num){
          switch(value.newsType){
            case 0:{
              $('#section4 .more').append('<div class="col-xs-6 text-right"><div class="news news-m"><div class="info"><small class="pull-right date">'+value.newsDate+'</small><span class="glyphicon glyphicon-plus-sign"></span><h4 class="title">'+value.newsName+'</h4>'+value.newsContent+'</div></div></div>')
              break;
            }
            case 1:{
              //$('#section4 .more').append('<div class="col-xs-6 text-right"><div class="news news-s"><div class="info"><small class="pull-right date">'+value.newsDate+'</small><h4 class="title">'+value.newsName+'</h4>'+value.newsContent+'</div></div></div>')
              $('#section4 .more').append('<div class="col-xs-6 text-right"><div class="news news-s"><div class="info"><small class="pull-right date">'+value.newsDate+'</small><h4 class="title">'+value.newsName+'</h4></div></div></div>')
              break;
            }
            case 2:{
              $('#section4 .more').append('<div class="col-xs-6 text-right"><div class="news news-l"><div class="info" data-toggle="modal" data-target="#infoBox1"><small class="pull-right date">'+value.newsDate+'</small><span class="glyphicon glyphicon-new-fullscreen"></span><h4 class="title">'+value.newsName+'</h4></div></div></div>');
              $('#infoBox1').find('.modal-title').text(value.newsName);
              $('#infoBox1').find('.modal-body').html('<p class="date text-right">'+value.newsDate+'</p>'+value.newsContent);
              break;
            }
          }
        }else if(index%2===1&&index<num){
          switch(value.newsType){
            case 0:{
              $('#section4 .more').append('<div class="col-xs-6 col-xs-offset-6 text-left"><div class="news news-m"><div class="info"><small class="pull-right date">'+value.newsDate+'</small><span class="glyphicon glyphicon-plus-sign"></span><h4 class="title">'+value.newsName+'</h4>'+value.newsContent+'</div></div></div>')
              break;
            }
            case 1:{
              // $('#section4 .more').append('<div class="col-xs-6 col-xs-offset-6 text-left"><div class="news news-s"><div class="info"><small class="pull-right date">'+value.newsDate+'</small><h4 class="title">'+value.newsName+'</h4>'+value.newsContent+'</div></div></div>')
              $('#section4 .more').append('<div class="col-xs-6 col-xs-offset-6 text-left"><div class="news news-s"><div class="info"><small class="pull-right date">'+value.newsDate+'</small><h4 class="title">'+value.newsName+'</h4></div></div></div>')
              break;
            }
            case 2:{
              $('#section4 .more').append('<div class="col-xs-6 col-xs-offset-6 text-left"><div class="news news-l"><div class="info" data-toggle="modal" data-target="#infoBox1"><small class="pull-right date">'+value.newsDate+'</small><span class="glyphicon glyphicon-new-fullscreen"></span><h4 class="title">'+value.newsName+'</h4></div></div></div>');
              $('#infoBox1').find('.modal-title').text(value.newsName);
              $('#infoBox1').find('.modal-body').html(value.newsContent);
              $('#infoBox1').find('.modal-header .date span').text(value.newsDate);
              break;
            }
          }
        }
      });
      $('.more .news').each(function(){
        $(this).css({'height':$(this).height()})
      });
    }

    //文字切换
    function change(){
      $('#s2_t h4.cur').removeClass('cur').siblings('h4').addClass('cur');
    }
    //鼠标滚动时触发的事件
    /*
    var scrollFunc=function(e){
        e=e||window.e;
        var d = -e.wheelDelta || e.detail; 
        if(!container.is(":animated") && !container.find("*").is(":animated")){
            current=$(".current");
            dataAnchor=$(".current").data("anchor");
            var top=0;
            // checkTop();
            if(d<0){
              top=checkFirstSection(top);
            }else if(d>0){
              top=checkLastSection(top);
            }
            container.animate({"top":top},0,'swing');
        }
    };*/
    $.fn.wheel = function (callback) {
        return this.each(function () {
          $(this).on('mousewheel DOMMouseScroll', function (e) {
            if (e.originalEvent&&tag) {
              if (e.originalEvent.wheelDelta) d = -e.originalEvent.wheelDelta;
              if (e.originalEvent.detail) d = e.originalEvent.detail;
            }            
            if(!container.is(":animated") && !container.find("*").is(":animated")&&tag){
              e.delta = null;
              current=$('.current');
              dataAnchor=$('.current').data('anchor');
              var top=0;

              if (typeof callback == 'function') {
                if(d<0){
                  top=checkFirstSection(top);
                }else if(d>0){
                  top=checkLastSection(top);
                }
                container.animate({"top":top},0,'swing');
                //console.log(top)
                callback.call(this, e);
              }
            }
          });
        });
    };

    $('body').wheel(function (e) {});

    //键盘触发的事件
    document.onkeydown = function(event) {
      event=event||window.event;
      if(!container.is(":animated") && !container.find("*").is(":animated")){
        current=$(".current");
        dataAnchor=$(".current").data("anchor");
        var top=0;
        var c = event.keyCode;
        /*
        if(index==10){
          tag=false;
        }else{
          tag=true;
        }
        */
        if (c==40&&tag||c==32&&tag||c==34&&tag) {
          top=checkLastSection(top);
          container.animate({"top":top},0,'swing');
        }else if (c==38&&tag||c==33&&tag) {
          top=checkFirstSection(top);
          container.animate({"top":top},0,'swing');
        }
        // checkTop();
       if (c == 39 && index <= 1) {
        $('a.carousel-control.right').trigger('click');

        }

        if (c == 37 && index <= 1) {
          $('a.carousel-control.left').trigger('click');

        }
      }
    }
    function checkLastSection(top){
      if(index===3){
            index=0;
            top=0;
        }else{
            index++;
            top=container.offset().top-h;
            sectionList.eq(index).addClass('current').siblings().removeClass('current');
        }
      //console.log(top)
      menu.eq(index).addClass('active').siblings().removeClass('active');
      current=$('.current');
      current.removeClass('current');
      sectionList.eq(index).addClass('current');
      moving(index);
      return top;
    }
    function checkFirstSection(top){
      if(index===0){
          index=3;
          top=-index*h;
      }else{
          index--;
          top=container.offset().top+h;
          sectionList.eq(index).addClass('current').siblings().removeClass('current');
      }
      //console.log(top)
      menu.eq(index).addClass('active').siblings().removeClass('active');
      current=$('.current');
      current.removeClass('current');
      sectionList.eq(index).addClass('current');
      moving(index);
      return top;
    }

    /*******左右切换效果******/
    /*$('#s1').on('slid.bs.carousel', function () {
      if($(this).find('#s1_2').hasClass('active')){
        $(this).find('#s1_2').addClass('cur');
      }

    })*/
		$('#s2').on('slid.bs.carousel', function () {
		  if(!$(this).find('.item').eq(0).hasClass('active')){
		  	clearInterval(t);
		  }else{
		  	t=setInterval(change,4000);
		  }
		})

    /*******icon切换效果******/
    $('.icon').each(function(){
      $(this).hover(function(){
        $(this).addClass('cur').siblings().removeClass('cur')
      });
    });
    /*******窗口大小改变时******/
    window.onresize=function(){
        /*******重新调整******/
        set();
        $('[data-resize]').wanker({delay: 500, duration: 2000});
    };
    /*******自适应字体大小******/
    $('h1').fontFlex(40, 70, 60);
    $('.btn,#s1_txt h3').fontFlex(16, 24, 70);
    $('#s1_2 h4,#s2_2 h4,#s2_t h4,#zc h4').fontFlex(14, 20, 80);
    $('#s1_2 .info').fontFlex(12, 18, 70);

    /*******modal模态框******/
    $('.modal').on('show.bs.modal', function (e) {
    	tag=false;
		  $(this).find('.modal-body').append('<div class="load"><img src="style/img/load.gif"></div>');
		}).on('shown.bs.modal',function(e){
			$(this).find('.load').remove();
		}).on('hidden.bs.modal',function(e){
			tag=true;
		});

  }
  obj.src=first_img.data("src");
    
}