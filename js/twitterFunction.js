tweetUI = {

    init: function () {

        //document ready functions
        $(document).ready(function () {

            windowResize();
            $('.broadShoulderContainer').masonry({
                itemSelector: '.contentArea',
                isAnimated: true,
                animationOptions: {
                    duration: 400
                },
                columnWidth: function (containerWidth) {
                    return containerWidth / columnCount;
                }
            });

            var throttled = _.throttle(windowResize, 100);
            $(window).resize(throttled);

            //click event which passes input data to dataForTwitterSearch
            $('.addBtn').live('click', function (event) {
                var $termInputBox = $('.searchTermInput').val();
                tweetUI.dataForTwitterSearch(event, $termInputBox);
            });

            //Allows user to press enter to add feed
            $('.form-search').ready(function () {
                $(window).keydown(function (event) {
                    if (event.keyCode == 13) {
                        event.preventDefault();
                        $('.addBtn').trigger('click');
                    }
                });
            });

            //Feed close button ('x')
            $('.closeBtn').live('click', function (event) {
                console.log('yep');
                $(this).parents('li').remove();
                $('.broadShoulderContainer').masonry('reload');
            });

        });

    },

    //gets the data from input and passes it into main function and clones contentArea
    dataForTwitterSearch: function (event, $termInputBox) {

        var $contentAreaBlank = $('.contentAreaBlank');

        if ($termInputBox != "") {
            event.preventDefault();
            $('.sidebarHiddenContent').slideUp(500);
            $contentAreaBlank.clone().appendTo('.broadShoulderContainer');
            searchTerm = $termInputBox;
            tweetUI.getTwitterDataAndAppend(searchTerm);
            $('.contentAreaBlank:last').removeClass('contentAreaBlank').addClass('contentArea').hide();
            $('.preloaderWrapper:last').show();
        }
        else {
            alert('empty');
        }

    },

    //turns icons next to '@' and '#' into links
    linkFunction: function () {

        $('.linkWrapper').each(function (index, element) {

            var $element = $(element);
            $arrowElement = $element.children('.arrowIcon');

            $arrowElement.click(function (event) {
                event.stopImmediatePropagation();
                var $target = $(event.target);
                $termInputBox = $target.siblings('.hashTag').attr('hashname');

                console.log($termInputBox);
                tweetUI.dataForTwitterSearch(event, $termInputBox);

            });

        });

    },

    //Only allows 4 feeds to be shown at once, and checks if any are empty and adds 'blank' content
    contentAreaCountAndIfEmpty: function (data) {

        var $broadShoulderContainer = $('.broadShoulderContainer');
        var feedCount = $broadShoulderContainer.children('li.contentArea').length;

        if (feedCount > 4) {
            var feedTitle = $('.contentArea:first').find('h3').text();
            var appendOldTitleHtml = '<li class="feedTitleItem">' + feedTitle + '</li>';
            $('.oldTitles').append(appendOldTitleHtml);
            $('.contentArea:first').remove('.contentArea:first');
            $broadShoulderContainer.masonry('reload');
        }
        else {
            //do nothing
        }

        var $widgetMainTextLast = $('.widgetMainText:last');
        var amountOfParagraphs = $widgetMainTextLast.find('p').length;
        var appendBlankMessage = '<h3>This is blank...</h3>';

        if (amountOfParagraphs < 1) {
            console.log('no text');
            $widgetMainTextLast.append(appendBlankMessage);
        }
        else {
            console.log('has text')
        }

    },

    //adds click event to 'old' feeds (after 4 have been displayed)
    oldTitlesFunction: function () {

        $('.feedTitleItem').click(function (event) {

            event.stopImmediatePropagation();
            var $target = $(event.target);
            $termInputBox = $target.text();
            console.log('old feed title ' + $termInputBox);

            tweetUI.dataForTwitterSearch(event, $termInputBox);

            $(this).remove('.feedTitleItem');

        });
    },

    //Error handling -- shows error message
    tweetError: function () {
        $('.errorBackground').fadeIn('slow');

        $('.contentArea:last').remove('.contentArea:last');

        setTimeout(function () {
            $(".errorBackground").fadeOut("slow");
        }, 2000);
    },

    //Number of tweets to show
    numTweets: 5,

    //main function -- gets data from twitter and appends to container
    getTwitterDataAndAppend: function (searchTerm) {

        var $broadShoulderContainer = $('.broadShoulderContainer');
        var $widgetMainTextLast = $(".widgetMainText:last");

        //user = searchTerm;
        user = 'bbcsport';
        console.log(user);

        $.ajax({
            //url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
            url: 'file:///C:/Projects/Tom/Tom/TwitterApp/js/testData.html',
            cache: true,
            type: 'GET',
            dataType: 'json',
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

                $('.contentArea:last').hide();
                $widgetMainTextLast.append("<h3>" + searchTerm + "</h3>");

                var textDefault = { textNiches: "No content..." };
                _.defaults(textDefault, { textNiches: "no text", dateNiches: "no date" });

                var textNiches = _.pluck(data, 'text');
                var dateNiches = _.pluck(data, 'created_at');

                console.log(textNiches, dateNiches);

                for (i = 0; i < data.length; i++) {
                    var appendedTweetDataHtml = "<p>" + tweetUI.ify.clean(textNiches[i]) + "</p>" +
                                                "<p>" + tweetUI.timeAgo(dateNiches[i]) + "</p>" +
                                                "<hr />";
                    $widgetMainTextLast.append(appendedTweetDataHtml);
                }

                tweetUI.contentAreaCountAndIfEmpty();
                tweetUI.linkFunction();
                tweetUI.oldTitlesFunction();
                $broadShoulderContainer.masonry('reload');
                $('.contentArea:last').fadeIn(500);
                $('.preloaderWrapper:last').fadeOut(500);

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


}