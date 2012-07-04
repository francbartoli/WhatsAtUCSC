// Choose Events 
$("#chooseEvent").live('pageshow',
function(event) {
    $.mobile.showPageLoadingMsg();
    $.getFeed({
        url: "https://www1.ucsc.edu/news_events/calendar/rss/Today.ashx",
        complete: function(feed) {
            //called when complete
            //alert('complete');
            },
        success: function(feed) {
            //called when successful
            $.mobile.hidePageLoadingMsg();
            $("#content ul").append('<li data-role="divider" data-theme="b">' + feed.title + '</li>');
            for (var i = 0; i < feed.items.length && i < 10; i++) {
                var item = feed.items[i];
                $("#content ul").append('<li><a href="' + item.link + +"rel=external" + '">' + item.title + '</a></li>');
            }

            // run refresh on the listview to get the theme added correctly
            $('#content ul').listview('refresh');
        },
        error: function(feed) {
            //called when there is an error
              $.mobile.hidePageLoadingMsg();
            qalert('Error: ' +error);
            }
    });

    // repeat the $.getFeed() call to pull in Events Manager
    //http://events-manager-dev.ucsc.edu/content/events-listing/rss.xml
    $.getFeed({
        url: "http://events-manager-dev.ucsc.edu/content/events-listing/rss.xml",
        complete: function(feed) {
            //called when complete
            //alert('complete');
            },

        success: function(feed) {
            //called when successful
            //alert('success' + feed.title);
            $("#content ul").append('<li data-role="divider" data-theme="b">' + feed.title + '</li>');
            for (var i = 0; i < feed.items.length && i < 10; i++) {
                var item = feed.items[i];
                //$("#content ul").append('<li><a href="'+item.link+'">'+item.title+'</a></li>');
                $("#content ul").append('<li><a href="' + item.link + '">' + item.title + '</a></li>');
            }
            // end of for loop
            // run refresh on the listview to get the theme added correctly
            $('#content ul').listview('refresh');
            // over ride the href to open in child browser
        },
        // end success block
        error: function(feed) {
            //called when there is an error
              $.mobile.hidePageLoadingMsg();
            alert('Error: ' +error);
            }
    });

}); // end of pageinit 
// End Campus Events


// Campus Buildings
$("#chooseBuilding").live('pageshow',
function(event) {
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url: "http://maps-d7-dev.ucsc.edu/departments_buildings?",
        type: "GET",
        dataType: "jsonp",
           async: "true",
        jsonpCallback: "mycallback",
        crossDomain: "true",
        data: "status=1&type=map_item&field_building_value=Yes&callback=mycallback",
        complete: function(data) {
            //called when complete
            //alert('complete');
            },
        success: function(data) {
            //called when successful
           $.mobile.hidePageLoadingMsg();
            //alert('success');
            // got JSON, now template it with mustache
            //extract the content from JSON, append it as <li>'s to the <ul>
            $('#templateTest').mustache(data).appendTo('#content ul');

            // run refresh on the listview to get the theme added correctly
            $('#content ul').listview('refresh');

            $('#buildingList').delegate('a', 'click',
            function() {
                //do click stuff here
                // build up the changePage data
                //alert($(this).attr("map-coordinates")); // just what we need
                var latLng = $(this).attr("map-coordinates");
                // pass latLng to map.html page
                //$.mobile.changePage("map.html", {transition: "slideup", data: latLng});
            });
        },
        error: function(data) {
            //called when there is an error
           $.mobile.hidePageLoadingMsg();
           alert('Error: ' +error);
            }
    });
});
// end of pageinit

// Campus Departments
$("#chooseDept").live('pageshow',
function(event) {
    $.mobile.showPageLoadingMsg();
    $.ajax({
        url: "http://maps-d7-dev.ucsc.edu/departments_buildings?",
        type: "GET",
           async: "true",
        dataType: "jsonp",
        jsonpCallback: "mycallback",
        crossDomain: "true",
        data: "status=1&type=map_item&field_dept_value=Yes&callback=mycallback",

        complete: function(data) {
            //called when complete
            //alert('complete');
            },
        success: function(data) {
           $.mobile.hidePageLoadingMsg();
            //called when successful
            //alert('success');
            // got JSON, now template it with mustache
            //extract the content from JSON, append it as <li>'s to the <ul>
            $('#templateTest').mustache(data).appendTo('#content ul');

            // run refresh on the listview to get the theme added correctly
            $('#content ul').listview('refresh');
        },
        error: function(data) {
            //called when there is an error
            //alert('error');
           $.mobile.hidePageLoadingMsg();
           alert("Error: " +error);
            }
    });
});
// end of pageinit

// Campus Map in Leaflet
$("#mapPage").live('pageshow',
function() {

    var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/9f3050d8434b471db9537c64fdf0ee1b//997/256/{z}/{x}/{y}.png',
    cloudmadeAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
    cloudmade = new L.TileLayer(cloudmadeUrl, {
        maxZoom: 18,
        attribution: cloudmadeAttribution
    });

    //process the URL for map coordinates to be handed to Leaflet
    // lat, lng must be float, not string! you lost 2 days on that one.
    // started messing with the makers and broke it.
    // need to back that out and start again.
    // default should show the UCSC popup
    // dept or building should show Title. May need to pass that as URL variable
    if (location.search.substring(1)) {
        var qs = location.search.substring(1);
        var url = qs.split(',', 3);
        var lng = parseFloat(url[0]);
        var lat = parseFloat(url[1]);
        //var zmn = parseFloat(url[2]);
        var zmn = parseFloat(16);

        var qsTitle = location.search.substring(2);
        var url = qsTitle.split(',', 3);
        var titleString = qsTitle.split('=');
        var title = decodeURIComponent(titleString[1]);
        var flag = 'deptMap';

    }
    else {
        var lat = 36.993;
        var lng = -122.061;
        var zmn = 14;
        var flag = 'defaultMap';
    }

    // Initialize the Leaflet map
    // Note my API key  9f3050d8434b471db9537c64fdf0ee1b
    var map = new L.Map('map', {
        center: new L.LatLng(lat, lng),
        zoom: zmn,
        layers: [cloudmade]
    });

    if (flag === 'deptMap') {
        var deptLocation = new L.LatLng(lat, lng),
        marker = new L.Marker(deptLocation);
        map.addLayer(marker);
        marker.bindPopup("<b>" + title + "</b><br />I am a popup ").openPopup();

    } else {
        var defaultLocation = new L.LatLng(36.993, -122.061),
        marker = new L.Marker(defaultLocation);
        map.addLayer(marker);
        marker.bindPopup("<b>University of California, Santa Cruz</b><br />I am a popup ").openPopup();
    }

    // the setTimeout function guarantees invalidateSize runs after everything is loaded.
    setTimeout(function() {
        map.invalidateSize();
    },
    1);

    // Leaflet geolocation code below
    // Placed into a $jquery() so that it doesn't fire off by itself
    $('#location').click(function() {
        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);

        map.locateAndSetView();

        function onLocationFound(e) {
            var radius = e.accuracy / 2;

            var marker = new L.Marker(e.latlng);
            map.addLayer(marker);
            marker.bindPopup("You are within " + radius + " meters from this point").openPopup();

            var circle = new L.Circle(e.latlng, radius);
            map.addLayer(circle);
        }

        function onLocationError(e) {
            alert(e.message);
        }
    });

});

// spinner configuration for ajax calls
$( document ).bind( 'mobileinit', function(){
                   $.mobile.loader.prototype.options.text = "loading";
                   $.mobile.loader.prototype.options.textVisible = false;
                   $.mobile.loader.prototype.options.theme = "b";
                   $.mobile.loader.prototype.options.html = "";
                   });

// Device Orientation
// this is now working fine. fires on index but not on other pages.
$(window).bind("orientationchange", function(e,type) {
               //$("#status").html("Orientation changed to "+e.orientation);
               alert("Orientation changed to "+e.orientation);
               
               });     

// have not woven this switch block in. it doesn't seem to be called.
function updateOrientation(e) {
    switch (e.orientation)
    {   
        case 0:
            // Do your thing
            alert('portrait'); 
            break;
            
        case -90:
            // Do your thing
            alert('landscape');
            break;
            
        case 90:
            // Do your thing
            alert('portrait');
            break;
            
        default:
            break;
    }
}



// RSS Feeds for Events
//used for caching
var feedCache= {};

function init() {
    
	//handle getting and displaying the intro or feeds		
	$("#intropage").live("pageshow",function(e) {  
                         displayFeeds();
                         });
	
	//Listen for the addFeedPage so we can support adding feeds
	$("#addfeedpage").live("pageshow", function(e) {
                           $("#addFeedForm").submit(function(e) {
                            handleAddFeed();
                            return false;
                            });
                           });
    
	//Listen for delete operations
	$(".deleteFeed").live("click",function(e) {
                          var delId = $(this).jqmData("feedid");
                          removeFeed(delId);
                          });
	
	//Listen for the Feed Page so we can display entries
	$("#feedpage").live("pageshow", function(e) {
                        //get the feed id based on query string
                        var query = $(this).data("url").split("=")[1];
                        //remove ?id=
                        query = query.replace("?id=","");
                        //assume it's a valid ID, since this is a mobile app folks won't be messing with the urls, but keep
                        //in mind normally this would be a concern
                        var feeds = getFeeds();
                        var thisFeed = feeds[query];
                        $("h1",this).text(thisFeed.name);
                        if(!feedCache[thisFeed.url]) {
                        $("#feedcontents").html("<p>Fetching data...</p>");
                        //now use Google Feeds API
                        $.get("https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q="+encodeURI(thisFeed.url)+"&callback=?", {}, function(res,code) {
                              //see if the response was good...
                              if(res.responseStatus == 200) {
                              feedCache[thisFeed.url] = res.responseData.feed.entries;
                              displayFeed( thisFeed.url);
                              } else {
                              var error = "<p>Sorry, but this feed could not be loaded:</p><p>"+res.responseDetails+"</p>";
                              $("#feedcontents").html(error);
                              }
                              },"json");
                        } else {
                        displayFeed(thisFeed.url);
                        }
                        
                        });
	
	//Listen for the Entry Page so we can display an entry
	$("#entrypage").live("pageshow", function(e) {
                         //get the entry id and url based on query string
                         var query = $(this).data("url").split("?")[1];
                         //remove ?
                         query = query.replace("?","");
                         //split by &
                         var parts = query.split("&");
                         var entryid = parts[0].split("=")[1];
                         var url = parts[1].split("=")[1];
                         
                         var entry = feedCache[url][entryid];
                         $("h1",this).text(entry.title);
                         $("#entrycontents",this).html(entry.content);
                         $("#entrylink",this).attr("href",entry.link);
                         // open page in child browser
                         $("#entrylink").bind('click', function(e) { 
                                              e.preventDefault();
                                              window.plugins.childBrowser.showWebPage(entry.link);
                                              });
                        });	
}


function displayFeed(url) {
	var entries = feedCache[url];
	var s = "<ul data-role='listview' data-inset='true' id='entrylist'>";
	for(var i=0; i<entries.length; i++) {
		var entry = entries[i];
		s += "<li><a href='entry.html?entry="+i+"&url="+encodeURI(url)+"'>"+entry.title+"</a></li>";
	}
	s += "</ul>";
    
	$("#feedcontents").html(s);
	$("#entrylist").listview();						
}

function displayFeeds() {
	var feeds = getFeeds();
	if(feeds.length == 0) {
		//in case we had one form before...
		$("#feedList").html("");
		$("#introContentNoFeeds").show();
	} else {
		$("#introContentNoFeeds").hide();
		var s = "";
		for(var i=0; i<feeds.length; i++) {
			s+= "<li><a href='feed.html?id="+i+"' data-feed='"+i+"'>"+feeds[i].name+"</a> <a href='' class='deleteFeed' data-feedid='"+i+"'>Delete</a></li>";
		}
		$("#feedList").html(s);
		$("#feedList").listview("refresh");
	}	
}

//handles checking storage for your feeds
function getFeeds() {
	if(localStorage["feeds"]) {
		return JSON.parse(localStorage["feeds"]);
	} else return [];
}

function addFeed(name,url) {
	var feeds = getFeeds();
	feeds.push({name:name,url:url});
	localStorage["feeds"] = JSON.stringify(feeds);
}

function removeFeed(id) {
	var feeds = getFeeds();
	feeds.splice(id, 1);
	localStorage["feeds"] = JSON.stringify(feeds);
	displayFeeds();
}

function handleAddFeed() {
    // psm mods
    // try setting the feedname and feedurl to the val and str of selectFeedurl (select menu)
   var feedname = $.trim($("#selectFeedurl option:selected").text());
   var feedurl = $.trim($("#selectFeedurl").val());
    
     //var feedname = $.trim($("#feedname").val());
	 //var feedurl = $.trim($("#feedurl").val());
	
	//basic error handling
	var errors = "";
	if(feedname == "") errors += "Feed name is required.\n";
	if(feedurl == "") errors += "Feed url is required.\n";
	
	if(errors != "") {
		//Create a PhoneGap notification for the error
		
		navigator.notification.alert(errors, function() {});
		
	} else {
		addFeed(feedname, feedurl);
		$.mobile.changePage("choose_events.html");
	}
}


