var j$ = jQuery.noConflict();


tweetUI = {

    config: {
        //$selectors
        j$addFeedButton: j$('.addBtn'),
        j$addFeedInputBox: j$('.searchTermInput'),
        j$addFeedForm: j$('.form-search'),
        j$feedCloseButton: j$('.closeBtn'),
        j$blankContentArea: j$('.contentAreaBlank'),
        j$arrowLinkWrapper: j$('.linkWrapper'),
        j$feedTitle: j$('.feedTitleItem'),

        //classes

        //Used for the main wrapper which the masonry reload function will be call on
        masonryContainerClass: '.broadShoulderContainer',
        
        //These are set to li's which wrap the individual content feeds
        masonryContentContainerClass: '.contentArea',
        masonryFirstContentContainerClass: '.contentArea:first',
        masonryLastContentContainerClass: '.contentArea:last',
        blankContentAreaClass: '.contentAreaBlank',
        lastBlankContentAreaClass: '.contentAreaBlank:last',
        //The last text area within the content
        contentLastTextArea: '.widgetMainText:last',

        //elements on the sidebar
        addFeedButtonClass: '.addBtn',
        addFeedInputBoxClass: '.searchTermInput',
        addFeedFormClass: '.form-search',
        hiddenSidebarClass: '.sidebarHiddenContent',

        //pre loader class
        lastPreloaderClass: '.preloaderWrapper:last',
        
        //these are used for the 'sideways' open feed functionality
        arrowLinkWrapperClass: '.linkWrapper',
        arrowIconClass: '.arrowIcon',
        linkSiblingClass: '.hashTag',

        //container for old feed titles
        oldFeedTitleClass: '.oldTitles',
        //individual title class
        feedTitleItemClass: '.feedTitleItem',

        //main error handling
        feedError: '.errorBackground',
        
        //class names without '.' for adding/removing
        toggleClassContentArea: 'contentArea',
        toggleClassContentAreaBlank: 'contentAreaBlank',

        //attr used on link as link for term for new feed
        linkCustomAttributeName: 'hashname',

        //tag that surrounds the feed title -- both should be the same
        contentTakenAsOldTitle:'h2',
        feedTitleWrapper: 'h2',

        //Blank message
        appendedMessageIfBlank: '<h3>This feed is blank...</h3>'

    },

    init: function (config) {

        //document ready functions
        j$(document).ready(function () {

            windowResize();
            j$(tweetUI.config.masonryContainerClass).masonry({
                itemSelector: tweetUI.config.masonryContentContainerClass,
                isAnimated: true,
                animationOptions: {
                    duration: 400
                },
                columnWidth: function (containerWidth) {
                    return containerWidth / columnCount;
                }
            });

            var throttled = _.throttle(windowResize, 100);
            j$(window).resize(throttled);

            //click event which passes input data to dataForTwitterSearch
            tweetUI.config.j$addFeedButton.live('click', function (event) {
                
                var j$termInputBox = j$(tweetUI.config.addFeedInputBoxClass).val();
                tweetUI.dataForTwitterSearch(event, j$termInputBox);
            });

            //Allows user to press enter to add feed
            tweetUI.config.j$addFeedForm.ready(function () {
                j$(window).keydown(function (event) {
                    if (event.keyCode == 13) {
                        event.preventDefault();
                        j$(tweetUI.config.addFeedButtonClass).trigger('click');
                    }
                });
            });

            //Feed close button ('x')
            tweetUI.config.j$feedCloseButton.live('click', function (event) {
                j$(this).parents('li').remove();
                j$(tweetUI.config.masonryContainerClass).masonry('reload');
            });

        });

    },

    //gets the data from input and passes it into main function and clones contentArea
    dataForTwitterSearch: function (event, j$termInputBox, config) {

        var j$contentAreaBlank = j$(tweetUI.config.blankContentAreaClass);

        if (j$termInputBox != "") {
            event.preventDefault();
            j$(tweetUI.config.hiddenSidebarClass).slideUp(500);
            j$contentAreaBlank.clone().appendTo(tweetUI.config.masonryContainerClass);
            searchTerm = j$termInputBox;
            tweetUI.getTwitterDataAndAppend(searchTerm);
            j$(tweetUI.config.lastBlankContentAreaClass).removeClass(tweetUI.config.toggleClassContentAreaBlank).addClass(tweetUI.config.toggleClassContentArea).hide();
            j$(tweetUI.config.lastPreloaderClass).show();
        }
        else {
            alert('empty');
        }

    },

    //turns icons next to '@' and '#' into links
    linkFunction: function (config) {

        j$(tweetUI.config.arrowLinkWrapperClass).each(function (index, element) {

            var j$element = j$(element);
            j$arrowElement = j$element.children(tweetUI.config.arrowIconClass);

            j$arrowElement.click(function (event) {
                event.stopImmediatePropagation();
                var j$target = j$(event.target);
                j$termInputBox = j$target.siblings(tweetUI.config.linkSiblingClass).attr(tweetUI.config.linkCustomAttributeName);

                console.log(j$termInputBox);
                tweetUI.dataForTwitterSearch(event, j$termInputBox);

            });

        });

    },

    //Only allows 4 feeds to be shown at once, and checks if any are empty and adds 'blank' content
    contentAreaCountAndIfEmpty: function (data, config) {

        var j$broadShoulderContainer = j$(tweetUI.config.masonryContainerClass);
        var feedCount = j$broadShoulderContainer.children(tweetUI.config.masonryContentContainerClass).length;

        if (feedCount > 4) {
            var feedTitle = j$(tweetUI.config.masonryFirstContentContainerClass).find(tweetUI.config.contentTakenAsOldTitle).text();
            var appendOldTitleHtml = '<li class="feedTitleItem">' + feedTitle + '</li>';
            j$(tweetUI.config.oldFeedTitleClass).append(appendOldTitleHtml);
            j$(tweetUI.config.masonryFirstContentContainerClass).remove(tweetUI.config.masonryFirstContentContainerClass);
            j$broadShoulderContainer.masonry('reload');
        }
        else {
            //do nothing
        }

        var j$widgetMainTextLast = j$(tweetUI.config.contentLastTextArea);
        var amountOfParagraphs = j$widgetMainTextLast.find('p').length;
        var appendBlankMessage = tweetUI.config.appendedMessageIfBlank;

        if (amountOfParagraphs < 1) {
            j$widgetMainTextLast.append(appendBlankMessage);
        }
        else {
            //do nothing
        }

    },

    //adds click event to 'old' feeds (after 4 have been displayed)
    oldTitlesFunction: function (config) {

        j$(tweetUI.config.feedTitleItemClass).click(function (event) {

            event.stopImmediatePropagation();
            var j$target = j$(event.target);
            j$termInputBox = j$target.text();
            tweetUI.dataForTwitterSearch(event, j$termInputBox);

            j$(this).remove(tweetUI.config.feedTitleItemClass);

        });
    },

    //Error handling -- shows error message
    tweetError: function () {
        j$(tweetUI.config.feedError).fadeIn('slow');

        j$(tweetUI.config.masonryLastContentContainerClass).remove(tweetUI.config.masonryLastContentContainerClass);

        setTimeout(function () {
            j$(tweetUI.config.feedError).fadeOut("slow");
        }, 2000);
    },

    //Number of tweets to show
    numTweets: 5,

    //main function -- gets data from twitter and appends to container
    getTwitterDataAndAppend: function (searchTerm, config) {

        var j$broadShoulderContainer = j$(tweetUI.config.masonryContainerClass);
        var j$widgetMainTextLast = j$(tweetUI.config.contentLastTextArea);

        user = searchTerm;
        //user = 'bbcsport';
        console.log(user);

        j$.ajax({
            url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
            //url: 'file:///C:/Projects/Tom/Tom/TwitterApp/js/testData.html',
            cache: true,
            type: 'GET',
            dataType: 'jsonp',
            data: {
                screen_name: user,
                include_rts: true,
                count: tweetUI.numTweets,
                include_entities: true
            },
            statusCode: {
                401: function () { alert("401"); }
            },
            timeout: 1500,
            success: function (data, textStatus, xhr) {

                j$(tweetUI.config.masonryLastContentContainerClass).hide();
                j$widgetMainTextLast.append("<" + tweetUI.config.feedTitleWrapper + ">" + searchTerm + "</" + tweetUI.config.feedTitleWrapper + ">");

                var textDefault = { textNiches: "No content..." };
                _.defaults(textDefault, { textNiches: "no text", dateNiches: "no date" });

                var textNiches = _.pluck(data, 'text');
                var dateNiches = _.pluck(data, 'created_at');

                console.log(textNiches, dateNiches);

                for (i = 0; i < data.length; i++) {
                    var appendedTweetDataHtml = "<p>" + tweetUI.ify.clean(textNiches[i]) + "</p>" +
                                                "<p>" + tweetUI.timeAgo(dateNiches[i]) + "</p>" +
                                                "<hr />";
                    j$widgetMainTextLast.append(appendedTweetDataHtml);
                }

                tweetUI.contentAreaCountAndIfEmpty();
                tweetUI.linkFunction();
                tweetUI.oldTitlesFunction();
                j$broadShoulderContainer.masonry('reload');
                j$(tweetUI.config.masonryLastContentContainerClass).fadeIn(500);
                j$(tweetUI.config.lastPreloaderClass).fadeOut(500);

            },
            error: function () {
                tweetUI.tweetError();

            }
        });
    },

    /**
    * relative time calculator FROM TWITTER
    * @param {string} twitter date string returned from Twitter API
    * @return {string} relative time like "2 minutes ago"
    */
    timeAgo: function (dateString) {
        var rightNow = new Date();
        var then = new Date(dateString);

        if (j$.browser.msie) {
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
            return Math.floor(diff / hour) + " hours ago";
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
    ify: {
        link: function (tweet) {
            return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function (link, m1, m2, m3, m4) {
                var http = m2.match(/w/) ? 'http://' : '';
                return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
            });
        },

        at: function (tweet) {
            return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function (m, username, user) {
                return '<span class="linkWrapper"><a hashname="' + username + '"target="_blank" class="twtr-atreply hashTag atTag" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username
		  						 + '</a><i class="icon-circle-arrow-right icon-large arrowIcon"></i></span>';
            });
        },

        list: function (tweet) {
            return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function (m, userlist) {
                return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
            });
        },

        hash: function (tweet) {
            return tweet.replace(/(^|\s+)#(\w+)/gi, function (m, before, hash, user, username, name) {
                return before + '<span class="linkWrapper"><a hashname="' + hash + '"target="_blank" class="twtr-hashtag hashTag" href="https://twitter.com/search?q=%23' + hash + '">#' + hash
		  + '</a><i class="icon-circle-arrow-right icon-large arrowIcon"></i></span>';
                //return before + '<span hashname="' + hash + '"class="hashTag">#' + hash + '</span><i class="icon-circle-arrow-right icon-large arrowIcon"></i>';
            });
        },

        clean: function (tweet) {
            return this.hash(this.at(this.list(this.link(tweet))));
        }
    } // ify


};