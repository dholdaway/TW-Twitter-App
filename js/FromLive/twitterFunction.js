tweetUI = {
	
	user:'bbcsport',
	numTweets: 5,
	appendTo:"widgetMainText",

	getTwitterDataAndAppend: function(searchTerm){
		
		user = searchTerm;
		
		console.log(user);
				
		$.ajax({
			url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
			cache:true,
			type: 'GET',
			dataType: 'jsonp',
			data: {
				screen_name: user,
				include_rts: true,
				count: tweetUI.numTweets,
				include_entities: true 
			},
			timeout:15000,
			success:function(data, textStatus, xhr){
				console.log('In Ajax', user);
				console.log(data);
				var img;
				//alert('yes2');
				//alert('yes3');
				$('.contentArea:last').hide();
				$(".widgetMainText:last").append("<h3>" + searchTerm +"</h3>");  
				//console.log(data.text);
				//$(".widgetMainText:last").append('<img src="' + data.user.profile_image_url + '" />');
				
				for(i=0; i < data.length; i++)
				{
					//$(".widgetMainText:last").append('<img src="' + data[i].user.profile_image_url + '" />');
					$(".widgetMainText:last").append("<p>" + tweetUI.ify.clean(data[i].text) + "</p>");  
					$(".widgetMainText:last").append("<p>" + tweetUI.timeAgo(data[i].created_at) + "</p>"); 
					//$(".widgetMainText:last").append("<p>" + data[i].user.screen_name + "</p>"); 
					//console.log(data[i].user.profile_image_url);
					$(".widgetMainText:last").append("<hr />");
				}
				linkFunction();
				oldTitlesFunction();
				$('.broadShoulderContainer').masonry('reload');
				addData();
				addCommentToBlankArea();
				$('.contentArea:last').fadeIn(500);
						
			},
			error:function(){
				$('.contentArea:last').remove('.contentArea:last');
				alert('These tweets may be protected');
			}
		});
	},
	
	 /**
      * relative time calculator FROM TWITTER
      * @param {string} twitter date string returned from Twitter API
      * @return {string} relative time like "2 minutes ago"
      */
    timeAgo: function(dateString) {
        var rightNow = new Date();
        var then = new Date(dateString);
         
        if ($.browser.msie) {
            // IE can't parse these crazy Ruby dates
            then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
        }
 
        var diff = rightNow - then;
 
        var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;
 
        if (isNaN(diff) || diff < 0) {
            return ""; // return blank string if unknown
        }
 
        if (diff < second * 2) {
            // within 2 seconds
            return "right now";
        }
 
        if (diff < minute) {
            return Math.floor(diff / second) + " seconds ago";
        }
 
        if (diff < minute * 2) {
            return "about 1 minute ago";
        }
 
        if (diff < hour) {
            return Math.floor(diff / minute) + " minutes ago";
        }
 
        if (diff < hour * 2) {
            return "about 1 hour ago";
        }
 
        if (diff < day) {
            return  Math.floor(diff / hour) + " hours ago";
        }
 
        if (diff > day && diff < day * 2) {
            return "yesterday";
        }
 
        if (diff < day * 365) {
            return Math.floor(diff / day) + " days ago";
        }
 
        else {
            return "over a year ago";
        }
    }, // timeAgo()
	
	/**
      * The Twitalinkahashifyer!
      * http://www.dustindiaz.com/basement/ify.html
      * Eg:
      * ify.clean('your tweet text');
      */
    ify:  {
      link: function(tweet) {
        return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
          var http = m2.match(/w/) ? 'http://' : '';
          return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
        });
      },
 
      at: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username, user) {
          return '<span class="linkWrapper"><a hashname="' + username + '"target="_blank" class="twtr-atreply hashTag atTag" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username 
		  						 + '</a><i class="icon-circle-arrow-right icon-large arrowIcon"></i></span>';
        });
      },
 
      list: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
        });
      },
 
      hash: function(tweet) {
        return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash, user, username, name) {
          return before + '<span class="linkWrapper"><a hashname="' + hash + '"target="_blank" class="twtr-hashtag hashTag" href="https://twitter.com/search?q=%23' + hash + '">#' + hash 
		  + '</a><i class="icon-circle-arrow-right icon-large arrowIcon"></i></span>';
		  //return before + '<span hashname="' + hash + '"class="hashTag">#' + hash + '</span><i class="icon-circle-arrow-right icon-large arrowIcon"></i>';
        });
      },
 
      clean: function(tweet) {
        return this.hash(this.at(this.list(this.link(tweet))));
      }
    } // ify

     
};




$(document).ready(function(){
	
	dataForTwitterSearch = function(event, $termInputBox){
		
		if( $termInputBox != ""){
			event.preventDefault();
			$('.sidebarHiddenContent').slideUp(500);
			$('.contentAreaBlank').clone().appendTo('.broadShoulderContainer');
			
			searchTerm = $termInputBox;
			
			tweetUI.getTwitterDataAndAppend(searchTerm);
			$('.contentAreaBlank:last').removeClass('contentAreaBlank').addClass('contentArea').hide();
		}
		else{
			alert('empty');	
		}
	}
	
	$('.addBtn').live('click', function(event){
		//if($('.searchTermInput:contains("#")')){
//			$(this).val().replace(/#/g, '%23');
//		}
		var $termInputBox = $('.searchTermInput').val();
		dataForTwitterSearch(event, $termInputBox);
	});
	
	
	
	
	linkFunction = function(){
	
		$('.linkWrapper').each(function(index, element) {
		
			var $element = $(element);
			$arrowElement = $element.children('.arrowIcon');
		
			$arrowElement.click(function(event){
				//event.preventDefault();
				event.stopImmediatePropagation();
				var $target = $(event.target);
				$termInputBox = $target.siblings('.hashTag').attr('hashname');
									
				console.log($termInputBox);
				dataForTwitterSearch(event, $termInputBox);
			});
		});
	}
	
	
	oldTitlesFunction = function(){
	
		$('.feedTitleItem').click(function(event){
			
			//event.stopImmediatePropagation();
			var $target = $(event.target);
			$termInputBox = $target.text();
			console.log('old feed title ' + $termInputBox);
		
			dataForTwitterSearch(event, $termInputBox);
			
			$(this).remove('.feedTitleItem');
			
		});
	}
	

	//Allows user to press enter to add feed
	$('.form-search').ready(function() {
		$(window).keydown(function(event){
			if(event.keyCode == 13) {
			  event.preventDefault();
			  $('.addBtn').trigger('click');
			}
		});
	});
	
	addData = function(data){
		var feedCount = $('.broadShoulderContainer').children('li.contentArea').length;
		
		if(feedCount > 4){
			var feedTitle = $('.contentArea:first').find('h3').text();
			console.log('title' + feedTitle);
			
			$('.oldTitles').append('<li class="feedTitleItem">' + feedTitle + '</li>');
			$('.contentArea:first').remove('.contentArea:first');
			$('.broadShoulderContainer').masonry('reload');
		}
		else{
			//do nothing
		}
		
	}
	
	addCommentToBlankArea = function(){
	
		console.log('1');
	
		var amountOfParagraphs = $('.widgetMainText:last').find('p').length;
	
		if(amountOfParagraphs < 1){
			console.log('yes 0');
			$('.widgetMainText:last').append('<h3>This is blank...</h3>');
		}
		else{
			console.log('NOOOO')
		}
		
	}
	
	
	//$('.trendsBtn').live('click', function(event){
//		$.ajax({
//			url: 'https://api.twitter.com/1/trends/1.json',
//			type: 'GET',
//			dataType: 'json',
//			timeout:15000,
//			success:function(data){
//				//$('.widgetMainText:first').append();
//				$('.contentArea:last').hide();
//				$(".widgetMainText:last").append("<h3>" + searchTerm +"</h3>");  
//				for(i=0; i < data.length; i++)
//				{
//					//$(".widgetMainText:last").append("<h3>" + searchTerm +"</h3>");  
//					$(".widgetMainText:last").append("<p>" + tweetUI.ify.clean(data[i].text) + "</p>");  
//					$(".widgetMainText:last").append("<p>" + tweetUI.timeAgo(data[i].created_at) + "</p>"); 
//					//$(".widgetMainText:last").append("<p>" + data[i].user.screen_name + "</p>"); 
//					
//					$(".widgetMainText:last").append("<hr />");
//				}
//				$('.broadShoulderContainer').masonry('reload');
//				$('.contentArea:last').fadeIn(500);
//				
//			},
//			error:function(){
//				alert('error');		
//			}
//		});
//	});



//$(document).ready(function(){
//
//
//
// $('.trendsBtn').live('click', function(event){
//
// 
//
//    
//
//  //get the JSON data from the Twitter search API
//
//  //$.getJSON("http://search.twitter.com/search.json?q=jquery4u&rpp=5&callback=?", function(data){
//
//  
//
//  $.getJSON("http://search.twitter.com/search.json?q=twosorethumbs&rpp=5&callback=?", function(data){
//
//  console.log(data.results);
//
//      //loop the tweets
//
//      $(data.results).each(function(i,v)
//
//      {
//
//          $(".resultstwitterbox").append("<p>" + this.from_user) +"</p>"; 
//
//        //  $(".resultstwitterbox").append("<img src='" + this.profile_img_url + "' />"); 
//
//          $(".resultstwitterbox").append("<img src='" + this.profile_image_url + "' />"); 
//
//          $(".resultstwitterbox").append("<p>" + this.text) +"</p>"; 
//
//      });
//
//  });
//
// 
//
// });

  

 

//});


		
	
});
