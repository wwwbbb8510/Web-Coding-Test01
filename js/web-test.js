//video pagination
var VideoPager = {
    cursor : 1,
    pageToken : [""],
    //add a page token
    addPageToken : function(pageToken){
        this.pageToken.push(pageToken);
        this.cursor++;
    },
    //remove a page token
    removePageToken : function(){
        if(this.cursor > 0){
            this.pageToken.pop();
            this.cursor--;
        }
    },
    //get current pageToken
    getCurrentPageToken: function(){
        return this.pageToken[this.cursor-1];
    },
    
    //get previous pageToken
    getPrevPageToken : function(){
        if(this.cursor-2 >=0){
            return this.pageToken[this.cursor-2];
        }
        return '';
    },
    //clear a page token
    clear : function(){
        this.cursor = null;
        this.pageToken = [];
        $('#prev_page_token').val("");
        $('#next_page_token').val("");
    }
};

/**
 * convert youtube item to a html video element 
 * @returns {DataItemVideoConverter}
 */
function DataItemVideoConverter(){
    this.containerType = null;//container type(search|recommend)
    this.item = null;//youtube item
}
//convert youtube item to html element
DataItemVideoConverter.prototype.toHtml = function(){
    var toHtml = '';
    if(this.containerType != null && 
            this.item != null &&
            this.item.id.videoId !== undefined){
        switch(this.containerType){
            case "search" :
                toHtml = "<div class=\"search-result-item\">" + 
                                "<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=" + this.item.id.videoId + "\">" +
                                    "<img src=\"" + this.item.snippet.thumbnails.medium.url + "\"/>" +
                                "</a>" +
                                "</div>";
                break;
            case "recommend" :
                toHtml = "<div class=\"recommendation-item\">" + 
                            "<a target=\"_blank\" href=\"https://www.youtube.com/watch?v=" + this.item.id.videoId + "\">" +
                                "<img src=\"" + this.item.snippet.thumbnails.medium.url + "\"/>" +
                            "</a>" +
                            "</div>";
                break;
        }
    }
    return toHtml;
}

/**
 * ajax getting videos for searching and recommendations
 * @returns {AjaxVideoQuerier}
 */
function AjaxVideoQuerier(){
    this.action = null;//ajax action
    this.query = null;//video query string
    this.pageToken = null;//page token used by youtube API to get the search results of the spcefic page
    this.videoContainer = null;//video container
    this.videoPagePrevContainer = null;//page token hidden input for previous page
    this.videoPageNextContainer = null;//page token hidden input for next page
    
    this.itemVideoConverter = new DataItemVideoConverter();//item video converter
}
//get videos
AjaxVideoQuerier.prototype.getVideos = function(){
    if(this.action != null && this.query != null){
        var params = { action: this.action, query: this.query};
        if(this.pageToken != null){
            params.page_token = this.pageToken;
        }
        var self = this;
        $.getJSON( "ajax.php", params )
            .done(function( data ) {
                if(data.nextPageToken && self.videoPageNextContainer != null){
                    self.videoPageNextContainer.val(data.nextPageToken);//set the next page token
                    if(VideoPager.getPrevPageToken() != null){//set the previous page
                        self.videoPagePrevContainer.val(VideoPager.getPrevPageToken());
                    }
                }
                if(data.items && self.videoContainer != null){
                    self.itemVideoConverter.containerType = self.action;
                    var video_html = "";
                    for(var i=0; i<data.items.length; i++){
                        self.itemVideoConverter.item = data.items[i];
                        video_html += self.itemVideoConverter.toHtml();
                    }
                    self.videoContainer.html(video_html);
                }
            })
            .fail(function( jqxhr, textStatus, error ) {
              var err = textStatus + ", " + error;
              console.log( "Request Failed: " + err );
        });
    }
}

//add recent searches
function fill_recent_search_html(){
    var params = { action: "recent"};
    $.getJSON( "ajax.php", params )
        .done(function( data ) {
            if(data){
                var recent_search_html = "";
                for(var i=0; i<data.length; i++){
                    recent_search_html += "<div class=\"col-sm-1 col-xs-2\">" + data[i] + "</div>";
                }
                $("#recent-searches").html(recent_search_html);
            }
        })
        .fail(function( jqxhr, textStatus, error ) {
          var err = textStatus + ", " + error;
          console.log( "Request Failed: " + err );
    });
}

//init the page and add the events
$(function() {
    //get the recent searches
    fill_recent_search_html();
    //get the search recommendations from youtube
    var objRecommendQuerier = new AjaxVideoQuerier();
    objRecommendQuerier.action = "recommend";
    objRecommendQuerier.videoContainer = $("#recommendation-box");
    function getRecommendations(query){
        objRecommendQuerier.query = query;
        objRecommendQuerier.getVideos();
    }
    getRecommendations(0);//recommendations for a new page --- use the newest search
    //get the search result from youtube
    var objSearchQuerier = new AjaxVideoQuerier();
    objSearchQuerier.action = "search";
    objSearchQuerier.videoPagePrevContainer = $('#prev_page_token');
    objSearchQuerier.videoPageNextContainer = $('#next_page_token');
    objSearchQuerier.videoContainer = $("#search-result-box");
    $('#search').click(function(){
        VideoPager.clear();
        objSearchQuerier.query = $("#query").val();
        objSearchQuerier.getVideos();
        getRecommendations(1);//recommendations for a query --- use the previous search
        fill_recent_search_html();//reset recent searches
    });
    //go to the previous page
    $("#previous").click(function(){
        objSearchQuerier.pageToken = $('#prev_page_token').val();
        VideoPager.removePageToken();
        objSearchQuerier.getVideos();
    });
    //go to the next page
    $("#next").click(function(){
        if($('#next_page_token').val() != null){
            objSearchQuerier.pageToken = $('#next_page_token').val();
            VideoPager.addPageToken($('#next_page_token').val());
            objSearchQuerier.getVideos();
        }
    });
});