$(function() {
    //get the search result from youtube
    $('#search').click(function(){
        $.getJSON( "ajax.php", { action: 'search', query: $("#query").val() } )
            .done(function( data ) {
                if(data.nextPageToken){
                    $('#page_token').val(data.nextPageToken);
                }
                if(data.items){
                    var search_result_html = "";
                    for(var i=0; i<data.items.length; i++){
                        search_result_html += "<div class=\"search-result-item\">" + 
                                "<a href=\"https://www.youtube.com/watch?v=" + data.items[i].id.videoId + "\">" +
                                    "<img src=\"" + data.items[i].snippet.thumbnails.medium.url + "\"/>" +
                                "</a>" +
                                "</div>";
                    }
                    $("#search-result-box").html(search_result_html);
                }
            })
            .fail(function( jqxhr, textStatus, error ) {
              var err = textStatus + ", " + error;
              console.log( "Request Failed: " + err );
        });
    });
});