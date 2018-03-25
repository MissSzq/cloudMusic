//https://route.showapi.com/213-1?keyword=关于南方破碎的理想&page=1&showapi_appid=52233&showapi_test_draft=false&showapi_timestamp=20171221201015&showapi_sign=6fdf0a000b13a5ccc489d6336c35573f
//b50cfc7cbe0a4558b171eed1fdf9cb7a
//52643



$(function () {
	var $Audio = $("audio"),
		$Tbody = $("tbody"),
		$Main = $("#main"),
		$play = $("#play");
	//初始化音量
	$Audio[0].volume = 1;
	getLyric(107609343);
	//初始化一首歌曲
	searchMusic("途中",1);

	//歌曲获取
	//songname:歌名  page：页数
	function searchMusic(songname,page) {
		$Main.find(".block").css("top",0);
		$Main.children(".content").css("top",0);
		$Tbody.html("");
		var url ="https://route.showapi.com/213-1?keyword="+songname+"&page="+page+"&showapi_appid=52643&showapi_test_draft=false&showapi_timestamp="+getTime()+"&showapi_sign=b50cfc7cbe0a4558b171eed1fdf9cb7a"
		//请求数据
		$.getJSON(url,function (msg) {
			var songInfo = msg.showapi_res_body.pagebean;
			var $List = songInfo.contentlist;

		//	存歌曲信息
			for(var key in $List){
				var $tr = $("<tr height='30'></tr>");
			//	记录歌曲属性
				$tr.data({
					singername: $List[key].singername,
					songname : $List[key].songname,
					albumpicbig :$List[key].albumpic_big,
					albumpicsmall :$List[key].albumpic_small,
					albumname : $List[key].albumname,
					songid : $List[key].songid,
					m4a : $List[key].m4a
				}).append($("<td>"+FM(key*1+1)+"</td><td>"+$List[key].songname+"</td><td>"+$List[key].singername+"</td><td>"+$List[key].albumname+"</td>"))
					.appendTo($Tbody);
			}
			if(songInfo.currentPage===1){//只在第一次存所有页数
				$Tbody.data("allPages",songInfo.allPages);
			}
			$Tbody.data({
				songname : songname,
				currentPage : songInfo.currentPage
			});
			$(function () {
				scrollBar($Main.find(".block"),$Main.children(".content"),$Main)
			})
		})
	}
	//歌曲滚动条
	function scrollBar($obj1,$obj2,$obj3) {
	//	$obj1滚动条滑块
	//	$obj2滚动监听高度的对象
	//	$obj3绑定滚动事件对象
		$obj3.off("mousewheel");
		var $obj1OffsetHeight = $obj1.offsetParent().height();
		$obj1.height($obj3.height()*$obj1OffsetHeight/$obj2.height());

	//	确定最大滚动范围
		var scrollMax = $obj1OffsetHeight - $obj1.height();
		var contentMax = $obj2.height() - $obj3.height();

		$obj3.on("mousewheel",function (e,d) {
			e.preventDefault();//阻止默认事件
			var top = $obj1.position().top;
			if(d>0){
				top -=30;
			}else{
				top +=30;
			}
			//设置滚动范围
			top = Math.max(0,top);
			top = Math.min(top,scrollMax);
			$obj1.css("top",top);
			$obj2.css("top",-top/scrollMax*contentMax)
		})
	}
	//翻页
	$(function () {
		var $firstPage = $("#firstPage"),
			$prevPage = $("#prevPage"),
			$nextPage = $("#nextPage"),
			$lastPage = $("#lastPage");

	//	下一页
		$nextPage.on("click",function () {
			//	确定不是最后一页
			if($Tbody.data("currentPage")===$Tbody.data("allPages"))return;
			searchMusic($Tbody.data("songname"),$Tbody.data("currentPage")+1);
		})
		//	上一页
		$prevPage.on("click",function () {
			//	确定不是第一页
			if($Tbody.data("currentPage")===1)return;
			searchMusic($Tbody.data("songname"),$Tbody.data("currentPage")-1);
		})
		//	首页
		$firstPage.on("click",function () {
			//	确定不是第一页
			if($Tbody.data("currentPage")===1)return;
			searchMusic($Tbody.data("songname"),1);
		})
		//	末页
		$lastPage.on("click",function () {
			//	确定不是最后一页
			if($Tbody.data("currentPage")===$Tbody.data("allPages"))return;
			searchMusic($Tbody.data("songname"),$Tbody.data("allPages"));
		})
	});
	//点击播放歌曲
	$Tbody.on("dblclick","tr",function () {
		$Audio.off("durationchange");
		//同步点击的歌曲显示

		synsong($(this));
		$Audio.prop("src",$(this).data("m4a"))[0].play();
		//存正在播放歌曲的index
		$Audio.data("showplay",$(this).index());
		$play.find(".playing").addClass("zanTing").removeClass("boFang");
		$Audio.on("durationchange",function () {//监听audio的时间变化
			var $TotalTime = $Audio[0].duration;
			$Audio.data({
				"maxTime":FM(Math.floor($TotalTime / 60)) + ":" + FM(Math.floor($TotalTime % 60)),//格式化后的总时间
				"TotalTime": Math.floor($TotalTime)//总时间
			});
			//更新歌曲总时间
			$play.find(".maxTime").html($Audio.data("maxTime"))
		});

	});
	//歌曲搜索
	$(function () {
		//enter搜索歌曲
		var $search = $("#header .search"),
			$searchI = $search.next();
		$search.on("keyup",function (e) {
			if(e.keyCode!==13)return;
			var val = $(this).val();
			if(val){
				searchMusic(val,1);
			}
		});
		//标签搜索歌曲
		$searchI.on("click",function () {
			var val = $search.val();
			if(val){
				searchMusic(val,1);
			}
		});
	});
	//播放/暂停/下一曲/上一曲
	$(function () {
		var $prev = $play.find(".prev"),
			$playing = $play.find(".playing"),
			$next = $play.find(".next");
	//	播放和暂停
		$playing.on("click",function () {
			if($(this).hasClass("boFang")){
				$Audio[0].play();
			}else{
				$Audio[0].pause();
			}
			$(this).toggleClass("zanTing boFang");
		});
	//	下一曲
		$next.on("click",function () {
			var showplay = $Audio.data("showplay")+1,
				$tr = $Tbody.children();
			showplay %= $tr.length;
			var m4a = $tr.eq(showplay).data("m4a");
			$playing.hasClass("boFang")?$Audio.prop("src",m4a):$Audio.prop("src",m4a)[0].play();
			$Audio.data("showplay",showplay);
			//歌曲小图标同步
			synsong($tr.eq(showplay));
		});
		//	上一曲
		$prev.on("click",function () {
			var showplay = $Audio.data("showplay")-1,
				$tr = $Tbody.children();
			showplay = showplay===-1?$tr.length-1:showplay;
			var m4a = $tr.eq(showplay).data("m4a");
			$playing.hasClass("boFang")?$Audio.prop("src",m4a):$Audio.prop("src",m4a)[0].play();
			$Audio.data("showplay",showplay);
			//歌曲小图标同步
			synsong($tr.eq(showplay));
		});
	});
	//播放滚动条
	function synScrolbar() {
		var $control = $(".control"),
			$progressBar = $control.find(".progressBar"),
			$bar = $progressBar.children(".bar");
		//获取播放时间
		var currentTime = $Audio[0].currentTime,
			time = FM(Math.floor(currentTime/60))  +":" +FM(Math.floor(currentTime%60))  ;
		//移动距离
		var x = currentTime/$Audio.data("TotalTime")*$progressBar.width();
		$control.find(".nowTime").html(time);
		$bar.css("left",x-$bar.width()/2);
		$progressBar.children(".red").css("width",x);

	}
	//拖动滚动条
	$(function () {
		//点击
		$(".progressBar .bar").on("mousedown",function (e) {
			$Audio.off("timeupdate");
			var $this = $(this);
			var oldleft = e.clientX,
				maxWidth = $this.parent().width(),
				left = $this.position().left;
			//拖动滑块
			$(document).on("mousemove", function (e) {
				var moveWidth = e.clientX - oldleft + left;

				//限制滑动距离
				moveWidth = Math.max(0,moveWidth);
				moveWidth = Math.min(moveWidth,maxWidth);

				$this.css("left",moveWidth - $this.width()/2);
				$this.prev().css("width",moveWidth);

			});
			//放开鼠标
			$(document).one("mouseup",function () {
				$Audio[0].currentTime = $this.prev().width()/maxWidth*$Audio.data("TotalTime");
				$Audio.on("timeupdate",function(){
					synScrolbar();
				});
				$(this).off("mousemove");
			})

		})
	});
	//拖动音量条
	$(function () {
		//点击
		$(".volumeBar .bar").on("mousedown",function (e) {
			var $this = $(this);
			var oldleft = e.clientX,
				maxWidth = $this.parent().width(),
				left = $this.position().left;
			//拖动滑块
			$(document).on("mousemove", function (e) {
				var moveWidth = e.clientX - oldleft + left;

				//限制滑动距离
				moveWidth = Math.max(0,moveWidth);
				moveWidth = Math.min(moveWidth,maxWidth);

				$this.css("left",moveWidth - $this.width()/2);
				$this.prev().css("width",moveWidth);
				$Audio[0].volume = moveWidth/maxWidth;

			});
			//放开鼠标
			$(document).one("mouseup",function () {
				$(this).off("mousemove");
			})

		})
	});
	//打开歌词层
	(function () {
		$(".sidebarFooter .icon-kuoda").click(layer);//点击图片切换显示层
		$(".lyric .lyricTop .icon-suoxiao2").click(closeLayer);//隐藏歌词页
		$(".contentDetails").css("opacity",0);

		//歌词页显示
		function layer() {
			$(".containerList").fadeTo(1000,0,function () {
				$(this).css("z-index",1)
				$(".contentDetails").fadeTo(1000,1,function () {
					$(this).css("z-index",3)
				})
			})
		}
	})();
	//歌词页关闭
	function closeLayer() {
		$(".contentDetails").fadeTo(1000,0,function () {
			$(this).css("z-index",0)
			$(".containerList").fadeTo(1000,1,function () {
				$(this).css("z-index",3)
			})
		})
	}
	//请求歌词
	function getLyric(songid) {
		$("#lyricList").html("")
		var url = "https://route.showapi.com/213-2?musicid="+songid+"&showapi_appid=52643&showapi_test_draft=false&showapi_timestamp="+getTime()+"&showapi_sign=b50cfc7cbe0a4558b171eed1fdf9cb7a"
		$.getJSON(url,function (msg) {
			$("#FMlyric").html(msg.showapi_res_body.lyric);//将歌词放到html标签中转换
			$("#FMlyric").html().replace(/\[([\d:.]+)\](.+)/g,function(a,$1,$2){//正则匹配时间和文字
				$("<li></li>").data("time",$1).html($2).appendTo($("#lyricList"))

			});
		})
	}



	//自动播放下一曲
	$(function () {
		$Audio.on("ended",function () {
			var showplay = $Audio.data("showplay")+1,
				$tr = $Tbody.children();
			showplay %= $tr.length;
			var m4a = $tr.eq(showplay).data("m4a");
			$Audio.data("showplay",showplay).prop("src",m4a)[0].play();
			//歌曲小图标同步
			synsong($tr.eq(showplay));
		});
		//下载当前
		$("#download").click(function () {
			var a = $("<a href='"+$Audio[0].src+"'></a>");
			a[0].download = "12";
			a[0].click();
		});
		$Audio.on("durationchange",function () {//监听audio的时间变化
			var $TotalTime = $Audio[0].duration;
			$Audio.data({
				"maxTime":FM(Math.floor($TotalTime / 60)) + ":" + FM(Math.floor($TotalTime % 60)),//格式化后的总时间
				"TotalTime": Math.floor($TotalTime)//总时间
			});
			//更新歌曲总时间
			$play.find(".maxTime").html($Audio.data("maxTime"))
		});
	});



	//audio的事件
	//audio的currentTime发生改变触发
	$Audio.on("timeupdate",function(){
		synScrolbar();
	});
/*//当资源刚加载开始：
	$Audio.on("loadstart",function () {
		var $sidebarFooter = $(".sidebarFooter"),
			$smallImg = $sidebarFooter.children("img"),
			$singname = $sidebarFooter.find(".singname"),
			$singername = $sidebarFooter.find(".singername");

		//  歌曲小头像
		$smallImg.prop("src",$(this).data("smallImg"));
		//  歌名
		$singname.html($(this).data("singname"))
		//  歌手名
		$singername.html($(this).data("singername"));
		getLyric($Audio.data("songid"))
		num = 0;
		$("#lyricList").css("top",0)

	});*/


	//同步歌曲图标歌名和歌手名
	function synsong($obj) {
		//同步点击的歌曲显示
		getLyric($obj.data("songid"));
		var $sidebarFooter = $(".sidebarFooter"),
			$songsamallImg = $sidebarFooter.children("img"),
			$songname = $sidebarFooter.find(".songname"),
			$singername = $sidebarFooter.find(".singername");
		//歌曲小图标
		$songsamallImg.prop("src",$obj.data("albumpicsmall"));
		//歌曲名
		$songname.html($obj.data("songname"));
		//歌手名
		$singername.html($obj.data("singername"))
	}
	//获取本地时间
	function getTime() {
		var date = new Date(),
			YY = date.getFullYear(),
			MM = FM(date.getMonth()+1),
			DD = FM(date.getDate()),
			hh = FM(date.getHours()),
			mm = FM(date.getMinutes()),
			ss = FM(date.getSeconds());
		return YY + MM + DD + hh +mm +ss;
	}
//格式化时间
	function FM(n) {
		return n<10?"0"+n:n+"";
	}

});





