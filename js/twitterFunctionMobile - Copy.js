$(document).ready(function(){
	
	
	searchTerm = '@tomjwilliamson';
	
	
	$('.addBtn').live('click', function(event){
		var $termInputBox = $('.searchTermInput').val();
		var $termInputHashReplace = $termInputBox.replace(/#/g, "o");
		
		if( $termInputBox != ""){
			event.preventDefault();
			$('.sidebarHiddenContent').slideUp(500);
			$('.contentAreaBlank').clone().appendTo('.broadShoulderContainer');
			
			searchTerm = $termInputBox;
			
			getTwitterDataAndAppend(searchTerm);
			$('.contentAreaBlank:last').removeClass('contentAreaBlank').addClass('contentArea').hide();
		}
		else{
			alert('empty');	
		}
	});
	
	//Allows user to press enter to add feed
	$('.form-search').ready(function() {
		$(window).keydown(function(event){
			if(event.keyCode == 13) {
			  event.preventDefault();
			  $('.addBtn').trigger('click');
			}
		});
	});


	getTwitterDataAndAppend = function(searchTerm){
		$.ajax({
			url: 'http://twitter.com/status/user_timeline/' + searchTerm + '.json?count=5&callback=?',
			dataType: 'json',
			timeout:15000,
			success:function(data){
				//$('.widgetMainText:first').append();
				$('.contentArea:last').hide();
				$(".widgetMainText:last").append("<h3>" + searchTerm +"</h3>");  
				for(i=0; i < data.length; i++)
				{
					//$(".widgetMainText:last").append("<h3>" + searchTerm +"</h3>");  
					$(".widgetMainText:last").append("<p>" + data[i].text) +"</p>";  
					$(".widgetMainText:last").append("<p>" + data[i].created_at +"</p>"); 	
					$(".widgetMainText:last").append("<hr />");
				}
				//$('.broadShoulderContainer').masonry('reload');
				$('.contentArea:last').fadeIn(500);
				
			},
			error:function(){
				alert('error');		
			}
		});
	}
	
	$('.trendsBtn').click(function(){
		$.ajax({
			url: 'https://api.twitter.com/1/trends/daily.json',
			dataType: 'json',
			timeout:15000,
			success:function(data){
				//$('.widgetMainText:first').append();
				$('.contentArea:last').hide();
				$(".widgetMainText:last").append("<h3>" + searchTerm +"</h3>");  
				for(i=0; i < data.length; i++)
				{
					//$(".widgetMainText:last").append("<h3>" + searchTerm +"</h3>");  
					$(".widgetMainText:last").append("<p>" + data[i].text) +"</p>";  
					$(".widgetMainText:last").append("<p>" + data[i].created_at +"</p>"); 	
					$(".widgetMainText:last").append("<hr />");
				}
				//$('.broadShoulderContainer').masonry('reload');
				$('.contentArea:last').fadeIn(500);
				
			},
			error:function(){
				alert('error');		
			}
		});
	});
	
	

	
});
