var peopleNum = 10;
var totlePopulation = peopleNum;

$(function() {
    showOrHide('story');
    showOrHide('thread');
    showOrHide('time');

    function showOrHide(obj){
    	
        var isfalse=false;
        $('#'+obj+'-note').click(function(){
            if(isfalse==false) {
                $('.table-show').css('display','none');
                $(this).css('display','block');
                $('#' + obj + '').css({'zIndex': '9'});
                $('#' + obj + '').animate({'right': '0'}, '1000')
                isfalse = true;
                if (obj == 'time') {
                        if($('#time-content-info').html()==''){
                        	var userId = $('#userId').html();
                        	var src = $('.head')[0].src + "";
//                        	alert(src);
                        	var actorId = src.substring(src.indexOf(".")-2, src.indexOf("."));
//                        	alert(actorId);
                        	var storyId = userId.substring(3, 5);
//                        	alert(storyId + actorId + "info.txt");
                            $.ajax({
                                url: storyId + actorId + "info.txt",
                                async: false,
                                success: function (data) {
                                    var msg=eval("("+data+")");
                                    for(var i= 0;i<msg.length;i++){
                                    	//alert();
                                        //console.log(msg[i]);
                                    
                                        $('#time-content-info').append('<div class="time-info"><div class="time-data">'+msg[i].date+' '+msg[i].time+'</div><div class="time-incident">'+msg[i].incident+'</div></div>');
                                        if (msg[i].status=='0'){
                                            $('.time-info').eq(i).addClass('time-incident-private');
                                        }
                                    }

                                },
                                error:function(){
                                    alert('error');
                                }
                            })
                        }

                $('#secret-btn').unbind('click');
                $('#secret-btn').click(function () {
                	$('.time-incident-private').css('color','red');
                    $('.time-incident-private').slideToggle();
                    
                })
            }
                if (obj == 'story'){
                    if($('#story-content').html()==''){
                    	//alert(window["storyContext"]);
                    	$('#story-content').html(window["storyContext"]);
                    }
                }

            }
            else {

                $('#' + obj + '').animate({'right': '-400px'}, '1000', function () {
                    $('#' + obj + '').css({'zIndex': '1'});
                    $('.table-show').css('display','block');
                });
                isfalse = false;
            }
    })
    }

    $(document).ready(function(){
        $.ajax({
            url:'thread.txt',
            type:'post',
            success: function (data) {
                var msg=eval("("+data+")");
                for(var i=0;i<msg.length;i++){
                    $('#thread-info').append('<input class="roominfo" type="button" value="'+msg[i].roomName+'">'+'</input>');
                };
                $('.roominfo').each(function(index){
                    $(this).click(function(){
                        //alert(index);
                    	console.log(msg[index]);

                    	//alert($('#userId').html());
                        var userId = $('#userId').html();
                        var roomId = userId.substring(0, 3);
                        $.ajax({
                            url:'./getClue.action',
                            type:'POST',
                            data:{'addrId':msg[index].addrId,
                            	'roomId' : roomId},
                            success:function(clueId){
                            	console.log(clueId);
                            	console.log("clueId:",clueId.clueId);
                            	if(clueId.clueId){
                            		$('#thread-content').append('<div class="thread-imgdiv"><img src="images/'+clueId.clueId+'.jpg" class="thread-img"/></div>');
                                	$('.thread-imgdiv').each(function(){
                                		$('.thread-imgdiv').unbind('click');
                                		$('.thread-imgdiv').click(function(){
                                			$(this).childNode()
//                                			var srccc=$('.thread-img').eq(i).attr('src');
                                			$('body').append('<div class="divimg" style="z-index:999;position:absolute;width:100%;height:100%;text-align:center;background-color:rgba(0,0,0,0.5);padding:4%;top:0;left:0;"><img class="hahaimg" src="images/'+clueId.clueId+'.jpg" style="display:block;width:80%;height:90%;"></div>')
                                			return false;
                                		})
                                	})
                                	$('body').on('click','.divimg',function(){
                                		$('.divimg').remove();
                                		return false;
                                	})
                            	}
                            	else{
                            		alert('没线索了！');
                            	}
                            	
                            }
                        });
                    });
                });
            },
            error:function(){
                alert('fail');
            }
        })
    })
})

