function windowResize() { 
  
  	//detects browser width
	var browserWidth = $(document).width();
	var newClass, container = $('.contentArea');
	
	//sets the column count in relation to the screen size
	if( browserWidth <= 480 ){
		columnCount = 1;
		newClass = 'oneColumnsInPage';
	}
	else if( browserWidth <= 768 ){
		columnCount = 2;
        newClass = 'twoColumnsInPage';
	}
	else if( browserWidth <= 1200 ){
		columnCount = 3;
        newClass = 'threeColumnsInPage';
	}
	else if( browserWidth >= 1200 ){
		columnCount = 4;
        newClass = 'fourColumnsInPage';
	}    
	
	container.removeClass('fourColumnsInPage').removeClass('threeColumnsInPage').removeClass('twoColumnsInPage').removeClass('oneColumnsInPage').addClass(newClass);
}