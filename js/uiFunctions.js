var j$ = jQuery.noConflict();

layoutUI = {

	init: function() {

		j$(document).ready(function(){
			
			j$('.widget').each(function(index, element){
				var $element = j$(element);
				var $commentArrow = j$('.commentArrow');
				var $commentBackground = j$('.commentBackground');
				
					$commentArrow.live('click', function(event){
						
						event.stopPropagation();
						
						$target = j$(event.target);
						$commentBackground.fadeIn(500);
						
						
						j$(".commentSubmit").click(function(event) {
						
							var commentHtml = ('<hr />' + '<div class="commentWrapper">' +
												'<p class="commentName">' + j$('#commentName').val()+'</p>' +
												'<p class="commentText">' + j$('#commentText').val()+'</p>' + '</div>' );
							
							//Stops the append happening more than once if the event has fired more than once before
							event.stopImmediatePropagation();
						
							$commentBackground.fadeOut(500);
							
							$target.parent($element).append(commentHtml);
							j$('.broadShoulderContainer').masonry('reload');
								
						});
						
					});
			});
			
			j$('.alphaWrapper, .closeBtn').click(function(){
				j$('.commentBackground').fadeOut();
			});
			
			j$('.fixedHeader').click(function(){
				j$('.sidebarHiddenContent').slideToggle(500);
			});
			
			j$('.addAnotherLink').click(function(event){
				event.stopPropagation();
				var $clone = j$('.searchTermInput:first').clone();
				$clone.val('');
				$clone.prependTo('.form-search');
			});
			//$('.form-search')

		});
	}
};


