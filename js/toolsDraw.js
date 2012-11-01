openDraw = function(open_){

	if(typeof(open_) === 'undefined' ){
		open_ = true;
	}
	//sets top of the draw to either 0(visible) or minus its height(hidden) 
	var newTop = open_ ? '0px' : firstDrawPosition + 'px';
	$toolsDrawOuter.animate({top: newTop}, {
		duration: 500,
		//Easing can be added here - from Jquery UI
		//specialEasing: {
		//top: 'easeOutQuint'
		//},
		step: function(now, fx){
			//make sure the content drawOuter and contentOuter animate at the same time
			$contentOuter.animate({marginTop: fx.now}, 0)
		}
	})
	//shows/hides buttons
	if(open_){
		$openBtn.hide();
		$closeBtn.show();
	}
	else{
		$openBtn.show();
		$closeBtn.hide();	
	}
}

initToolsDraw = function(){
	
	headerHeight = $('header').height();
	var topOfDrawPosition = headerHeight + firstDrawPosition;
	var drawPosition = $toolsDrawOuter.position().top;
	var offsetWhenHidden = $toolsDrawOuter.position().top;
	var startDrawPosition;
	
	$toolsDrawOuter.draggable({
		handle: $drawBtn,
		axis: 'y',
		containment: [0, -124, 0 ,76],
		scroll:false,
		
		start: function(event, ui){
			console.log(topOfDrawPosition, headerHeight)
			//detect the direction of drag
			fixPositionOfMainContent(ui.position.top)
			startDrawPosition = $toolsDrawOuter.position().top;
		},
		
		drag:function(event, ui) {
			fixPositionOfMainContent(ui.position.top)
			
		},
		
		stop: function(event, ui) {
			var drawPosition = $toolsDrawOuter.position().top;
			//forced tools draw open or closed
			if( drawPosition == topOfDrawPosition || drawPosition == headerHeight){
				//draw is fully closed or open			
			}
			else{
				var drawBeingOpened = (startDrawPosition - drawPosition) < 0;
				openDraw(drawBeingOpened);
			}
			//displays correct button when drag stops - fixes mouseup event error when outside of click area
			if(startDrawPosition == drawPosition){
				//do nothing - visible button controlled by open draw function
			}
			else if(startDrawPosition < drawPosition){
				$openBtn.hide();
				$closeBtn.show();
			}
			else{
				$openBtn.show();
				$closeBtn.hide();
			}
		}
	});
	
}
resize = function(){
	
	var headerHeight = $('header').height();
	if(headerHeight != headerHeight){
		headerHeight = headerHeight;
		var topOfDrawPosition = headerHeight + firstDrawPosition;
		$toolsDrawOuter.draggable({
			containment: [0, topOfDrawPosition, 0 ,headerHeight]
		});
	}
}

//makes sure the top of the main content is next to the bottom of the tool draw
fixPositionOfMainContent = function(drawPosition) {
	
	if (typeof(drawPosition) === 'undefined') {
		drawPosition = $toolsDrawOuter.position().top;
	}
	
	var topOfDrawPosition =  headerHeight + firstDrawPosition;
	var contentPosition = topOfDrawPosition - drawPosition + toolsDrawHeight - headerHeight;
	minusContentPosition = Math.abs(contentPosition)* -1; 
		
	$contentOuter.css('margin-top', minusContentPosition);		
}

$(document).ready(function(){
	
	$toolsDrawOuter = $('.toolsDrawOuter');
	$contentOuter = $('.contentOuter');
	
	//find the height of the draw then turn it into a negative number
	toolsDrawHeight = $toolsDrawOuter.height();
	firstDrawPosition = Math.abs(toolsDrawHeight)* -1; 
	
	$openBtn = $('.openBtn');
	$closeBtn = $('.closeBtn');
	
	var $toolsDraw = $('.toolsDraw');
	$drawBtn = $('.drawBtn');
	var $internalCloseBtn = $('.internalCloseBtn');
	var $this = $(this); 
		
	//Hide tools draw
	$toolsDrawOuter.css('top', firstDrawPosition + 'px').css('display', 'block');	
	openDraw(false);
		
	//Hide/show on click - reads the height of the header than adds this to the onload draw position which is a negative number	
	$drawBtn.click(function(){
		var headerHeight = headerHeight;
		var topOfDrawPosition = headerHeight + firstDrawPosition;
		var drawPosition = $toolsDrawOuter.position().top;
						
		if( drawPosition < 0 ){
			//draw is fully closed
			openDraw();
		}
		else if(drawPosition > 0){
			//draw is fully open
			openDraw(false);
		}
		else{
			//draw is partially open - animation is on-going
			//do nothing
		}
	});
	
	//Internal close button function and button states
	$internalCloseBtn.click(function(){
		openDraw(false);
	});
	$internalCloseBtn.mousedown(function() {
		$internalCloseBtn.addClass('internalCloseBtnActive');
	});	
	//Draw button states
	$drawBtn.mousedown(function() {
		$drawBtn.addClass('drawBtnActive');
	});
	//Remove active states from buttons - fixes mouseup error when not on click target
	$this.mouseup(function() {
		$drawBtn.removeClass('drawBtnActive');
		$internalCloseBtn.removeClass('internalCloseBtnActive');
	});
	
	//drag event
	initToolsDraw();
	//fix layout/drag issues if header height is different between screen sizes
	$(window).resize(function() {
		resize();	
	});
});