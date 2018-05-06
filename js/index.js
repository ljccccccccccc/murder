$(document).ready(function(){
	var connectWebsocket = function(url, OnOpen, OnMessage, OnClose) {
		url = url.replace("http://", "ws://");
		var webSocket = new WebSocket(url);
		window.webSocket = webSocket;
		webSocket.onopen = OnOpen;
		webSocket.onmessage = OnMessage;
		webSocket.onclose = OnClose;
	};
	
	var createRoomData = {"storyId" : "",
							"peopleNum": 0,
							};
	
	window.getData = function(theStory) {
		createRoomData.storyId = theStory.dataset.storyid;
		createRoomData.peopleNum = theStory.dataset.peoplenum;
		// console.log(theStory);
		console.log(createRoomData);
	};
	
	var dealCreatRoomSuccess = function(data) {
		$('#rightpart').hide();
		var storyId = data.storyId;
		var storyBack = baseData.storyData[storyId]["storyBack"];
		$("#storyBack").html(storyBack);
		$('#roomNumber').html(data.roomId);
		$('#userId').html(data.userId);
		dealActorsInit(data.peopleNum, storyId);
	};
	
	var dealActorsInit = function(totlePopulation, storyId) {
		 var actorStr1='<div class="rightpart-info"><div class="rightpart-headdiv"></div><img src="images/tou.jpg" alt="actor" class="rightpart-head"/><div class="rightpart-soh"><p class="actorname"></p><p class="actorstory"></p></div></div>'
	            popleRepeate2('#rightpart','',actorStr1,'');


            function popleRepeate2(obj,meg,aStr,bStr){
                var str = $(obj).html();
                for (var i = 0; i < totlePopulation; i++) {
                    meg +=  aStr+bStr;
                    $(obj).html(str + meg)
                }
            }
	};
	
	var dealJoinRoomSuccess = function(data) {
		$('#rightpart').hide();
		var userId = data.userId;
		$('#roomNumber').html(userId.substring(0, 3));
		$('#userId').html(userId);
		
		dealActorsInit(data.peopleNum, userId.substring(3, 4));
		var totlePopulation = userId.substring(5, 7);
		//TODO		alert(totlePopulation);
		addUserHead(totlePopulation, parseInt(userId)-totlePopulation+1);
	};
	
	var addUserHead = function(totlePopulation, minUserId) {
		var string1='<div class="personinfo"><img class="head" id="img'
			 var string2 = '" src="images/tou.jpg" alt="头像" style="width: 80px;height: 80px;border-radius: 50%;margin: 0 auto;display: block;"><p><span class="userid"></span></p><p class="gamingpositionid">';
	         var string3='玩家</p></div>';
	         popleRepeate1('.userlist','',string1,string2,string3);
         function popleRepeate1(obj,meg,aStr,bStr,cStr){
             var str = $(obj).html();
             for (var i = 0; i < totlePopulation-1; i++) {
                 meg +=  aStr+(((parseInt(minUserId)+i)+10000000)+"").substring(1)+bStr+(((parseInt(minUserId)+i)+10000000)+"").substring(1)+cStr;
                 $(obj).html(str + meg);
             }
         }
	};
	
	var dealActHeadInit = function() {
		//TODO		alert("dahi");
		var rphs = $('.rightpart-head');
		console.log(rphs);
		//TODO	alert(rphs.length);
		var userId = $('#userId').html();
    	var storyId = userId.substring(3, 5);
    	console.log(rphs.length);
    	console.log("images/tou" + storyId + index +".jpg");
    	for(var i = 0; i < rphs.length; i++) {
			var index = ((100+i)+"").substring(1);
			rphs[i].src = "images/tou" + storyId + index +".jpg";
		}
	};
	
	var dealWSRecieve = function(json) {
		var data = json.data;
		var index = data.indexOf(":");
		var command = data.substring(0, index);
		var message = data.substring(index+1);
		console.log("command", command);
		console.log("message", message);
		if(command === "join") {
			var totlePopulation = message.substring(5);
			 var string1='<div class="personinfo"><img class="head" id="img'
			 var string2 = '" src="images/tou.jpg" alt="头像" style="width: 80px;height: 80px;border-radius: 50%;margin: 0 auto;display: block;"><p><span class="userid"></span></p><p class="gamingpositionid">';
	         var string3='玩家</p></div>';
	         popleRepeate1('.userlist','',string1,string2,string3);
	         function popleRepeate1(obj,meg,aStr,bStr,cStr){
	             var str = $(obj).html();
                 meg += aStr + message + 	bStr + message + cStr;
                 $(obj).html(str + meg);
	         }
		}
		if(command === "ready") {
			alert("人已经到齐，可以开始游戏。");
			var html = $('#onehead').html();
			html += "<button id=\"startGame\">开始</button>"
			$('#onehead').html(html);
			$('#startGame').click(function(){
				
				var roomId=$('#roomNumber').html();
							alert(roomId+"??");
				$.ajax({
			           url:'./startRoom.action',
			           type:'POST',
			           data:{"roomId":roomId},
			           success:function(data){
			           	console.log(data);
			               if(data.status==='success'){
			               } else if(data.status==='error'){
			               }
			             //TODO               alert(data.status);
			           },
			           error:function(){
			           }
			       });
				$('#startGame').remove();
			});
		}
		if(command === "start") {
			$('#rightpart').show();
			dealActHeadInit();
			
//			$('.rightpart-soh').each(function(index){
//				alert("---------------");
//				var storyId = message.substring(3, 5);
//				alert(storyId+"]?");
//				console.log(baseData.storyData[storyId]);
//				console.log(index);
//				var name = baseData.storyData[storyId].actors[index].name;
//				alert(storyId+"]?["+name);
//			});
			
			
		  $('.rightpart-head').each(function(index){
            	$('.rightpart-headdiv').eq(index).on('mouseenter',function(){
            		var name = baseData.storyData[message].actors[index].name;
            		var brief = baseData.storyData[message].actors[index].brief;
            		//TODO 能优化
        			$('.actorname').eq(index).html(name);
                	$('.actorstory').eq(index).html(brief);
            		console.log($('.actorname').eq(index).html.length+'hahaahhhaahahahahahahah');
            		$('.rightpart-soh').eq(index).css('display','block');
            	}).on('mouseleave',function(){
            		console.log('2');
            		$('.rightpart-soh').eq(index).css('display','none');
                   
                })
            });
		}
		if (command === "choseActor") {
			var userId = message.substring(0, 7);
			var actorId = message.substring(7);
			var acHead = $('.rightpart-head')[parseInt(actorId)];
			var userHead = $('#img' + userId).length>0 ? $('#img' + userId)[0] : $('.head')[0];
			console.log(userHead);
			var i = userHead.src.substring(userHead.src.indexOf(".")-2,userHead.src.indexOf("."));
			//TODO			alert("{}"+i+"?-----["+parseInt(i)+"]");
			console.log(parseInt(i),"?");
			if(!isNaN(parseInt(i))) {
				//TODO				alert("parseInt(i)"+parseInt(i)+":");
				var oldAcHead = $('.rightpart-head')[parseInt(i)];
				console.log(oldAcHead,"?oldAcHead");
				var userId = $('#userId').html();
		    	var storyId = userId.substring(3, 5);
				oldAcHead.src = "images/tou"+storyId+i+".jpg";
			}
			//TODO			alert(userHead.src);
			userHead.src = acHead.src;
			acHead.src = "images/kill.jpg";
			//TODO
		}
	};
	$('#div-game').hide();
	//$('#rightpart').hide();
	$('#rightpart-gaming').hide();
	$('#div-createRoom').hide();
	
	$('#indexdiv').fadeIn(500);//淡入特效
	
	
	$('#createRoom').click(function(){
		$('#indexdiv').fadeOut(500, function () {
			$('#kill').fadeIn(500, function () {
				$('#kill').fadeOut(500,function(){
					$('#div-join').hide();
					$('#div-createRoom').show();
				});
			});
		});
	});
	
	$('#joinRoom').click(function(){
        var roomId=$('#roomId').val();
		  $.ajax({
		      url:'./joinRoom.action',
		      type:'POST',
		      data:{'roomId':roomId},
		      success:function(data){
		      	console.log(data);
		          if(data.status==='success'){
		        	  dealJoinRoomSuccess(data);
		              var locatin = window.location+"";
		              var url = locatin.substring(0, locatin.lastIndexOf("/")) + "/userLoginListener";
		              connectWebsocket(url, function(){
		              	console.log("this", this);
		              	this.send("joinRoom:"+data.userId);
		              }, function(json){
		            	  dealWSRecieve(json);
		              	console.log(json);
		              	console.log(json+"[join,recieve]"+data.userId);
		              }, function(){});
		          } else if(data.status==='error'){
		              alert('error');
		          }
		          alert(data.status);
		      },
		      error:function(){
		          alert('请求发送失败');
		      }
		  });
	  $('#indexdiv').fadeOut(500, function () {
			$('#kill').fadeIn(500, function () {
				$('#kill').fadeOut(500,function(){
					$('#div-join').hide();
					$('#div-game').show();
				})
			});
		});
	});
	
	$('#chose-story').click(function(e){
		createRoomData.storyId = $(e.target).attr("data-storyid");
		createRoomData.peopleNum = $(e.target).attr("peopleNum");
	});
	
	$('#btn-createRoom').click(function(e){
		console.log(createRoomData);
		createRoomData.storyId="01";
		 $.ajax({
           url:'./createRoom.action',
           type:'POST',
           data:createRoomData,
           success:function(data){
           	console.log(data);
               if(data.status==='success'){
//TODO                   alert("sucess1`");
                   dealCreatRoomSuccess(data);
                   var locatin = window.location+"";
                   var url = locatin.substring(0, locatin.lastIndexOf("/")) + "/userLoginListener";
                   connectWebsocket(url, function(){
                   	this.send("creatRoom:" + data.userId);
                   }, function(json){
                 	  console.log(json);
                 	  dealWSRecieve(json);
                   }, function(){});
               } else if(data.status==='error'){
                   alert('error');
               }
             //TODO              alert(data.status);
           },
           error:function(){
               alert('请求发送失败');
           }
       });
		
		$('#div-createRoom').hide();
		$('#div-game').show();
	});	
	
	
	//-------------------首页按下enter-------------------//
	$(document).on('keydown', function (event) {
		if (event.keyCode == 13) {
			//动画
			$('#indexdiv').fadeOut(2000, function () {
				$('#kill').fadeIn(2000, function () {
					$('#kill').fadeOut(2000)
				});
			});
		}
	});
//-------------------首页按下enter-------------------//

//-------------------首页js动态布局-------------------//
	function cssSet() {
		var screenWidth = parseInt($(document).width());
		var screenHeight = parseInt($(document).height());
		var divWidth = parseInt($('#indexdiv').css('width'));
		var divHeight = parseInt($('#indexdiv').css('height'));
		var imgWidth = parseInt($('#kill').css('width'));
		var imgHeight = parseInt($('#kill').css('height'));

		$('#indexdiv').css({
			'marginLeft': screenWidth / 2 - divWidth / 2 + 'px',
			"marginTop": screenHeight / 2 - divHeight + 'px'
		});

		$('#kill').css({
			'left': screenWidth / 2 - imgWidth - 50 + 'px',
			'top': screenHeight / 2 - imgHeight + 'px',
			'zIndex': '-1',
			'display': 'none'
		});
	}
	
	cssSet();
//-------------------首页js动态布局-------------------//

	$('#chose-story').click(function(e){
		createRoomData.storyId = $(e.target).attr("storyId");
		createRoomData.peopleNum = $(e.target).attr("peopleNum");
	});
	$('#rightpart').click(function(e){
		var index = $(e.target).parent().index();
		if ($('.rightpart-head')[index].src.indexOf("images/kill.jpg") > 0) {
			alert("Error"+$('.rightpart-head')[index].src);
			return;
		};
		index = ((100+index)+"").substring(1);
		var userId=$('#userId').html();
		var storyId = userId.substring(3,5);
		var actorName = baseData.storyData[storyId].actors[index];
		$.ajax({
	           url:'./choseActor.action',
	           type:'POST',
	           data:{"userId":userId,
	        	   		"actorId":index},
	           success:function(data){
	        	   $('.readysuccess').show();
        	   $('.readysuccess').html('<a id="readyStart">开始</a>');
        	   ReadyStartActionListener();
	           	console.log(data);
	            window["storyContext"] = data.storyContext; 
//	           	alert(data.storyContext);
	           },
	           error:function(){
	           }
	       });
	});
	
	var ReadyStartActionListener = function() {
		$('#readyStart').click(function(e){
			$('#readyStart').hide();
			$('#rightpart').hide();
			$('#rightpart-gaming').show();
			var userId = $('#userId').html();
        	var storyId = userId.substring(3, 5);
			$('#mapinfo').html('<img style="width:100%;height:100%;display:block;" src="images/map'+storyId+'.jpg">');
		});
	};
});