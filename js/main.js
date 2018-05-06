jQuery(document).ready(function($){

    //获取故事数据，渲染dom
    // console.log(baseData);
//	let center = document.getElementsByClassName('center')[0];		
//	for(let id in baseData.storyData) {
//		center.innerHTML += '<a data-storyid="${id}" peopleNum="6" href="#0" class="cd-btn cd-modal-trigger">${baseData.storyData[id].storyName}</a><br><br><br>';		
//	}
    //获取完了



	//cache some jQuery objects
	var modalTrigger = $('.cd-modal-trigger'),
		transitionLayer = $('.cd-transition-layer'),
		transitionBackground = transitionLayer.children(),
		modalWindow = $('.cd-modal');

	var frameProportion = 1.78, //png frame aspect ratio
		frames = 25, //number of png frames
		resize = false;

	//set transitionBackground dimentions
	setLayerDimensions();
	$(window).on('resize', function(){
		if( !resize ) {
			resize = true;
			(!window.requestAnimationFrame) ? setTimeout(setLayerDimensions, 300) : window.requestAnimationFrame(setLayerDimensions);
		}
	});
	//open modal window
	modalTrigger.on('click', function(event){	


		//添加js
			event = event || window.event;
			console.log(event.target.dataset);
			let theId = event.target.dataset.storyid;		//event.target是当前事件对象，dataset是获得自定义属性
			document.getElementsByClassName('modal-content')[0].childNodes[3].innerText = baseData.storyData[theId].storyBack;

		//添加js完了



		event.preventDefault();
		transitionLayer.addClass('visible opening');
		var delay = ( $('.no-cssanimations').length > 0 ) ? 0 : 600;
		setTimeout(function(){
			modalWindow.addClass('visible');
		}, delay);
	});

	//close modal window
	modalWindow.on('click', '.modal-close', function(event){
		event.preventDefault();
		transitionLayer.addClass('closing');
		modalWindow.removeClass('visible');
		transitionBackground.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
			transitionLayer.removeClass('closing opening visible');
			transitionBackground.off('webkitAnimationEnd oanimationend msAnimationEnd animationend');
		});
	});

	function setLayerDimensions() {
		var windowWidth = $(window).width(),
			windowHeight = $(window).height(),
			layerHeight, layerWidth;

		if( windowWidth/windowHeight > frameProportion ) {
			layerWidth = windowWidth;
			layerHeight = layerWidth/frameProportion;
		} else {
			layerHeight = windowHeight*1.2;
			layerWidth = layerHeight*frameProportion;
		}

		transitionBackground.css({
			'width': layerWidth*frames+'px',
			'height': layerHeight+'px',
		});

		resize = false;
	}

});