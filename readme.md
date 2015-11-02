Youtube search box example
============================

Installation
----------------------------
Since the example is using Ajax request with PHP as the server side, PHP server is required
Copy the git repo into your web server root directory
Open index.html in the browser

Features
----------------------------
For the search results, there are 5 videos displayed each page and swap pages by clicking the Prev button and the Next button
For the recommendations, when the page is most recent loaded the videos of the latest search in the Session will be loaded; when cliking the Search button the videos of the second most recent videos in the Session will be loaded
For the recent searches, the recent file searches in the Session are displayed

Code briefs
----------------------------
This example is based on bootstrap as the css framework and JQuery as the JS framework
The file named ajax.php is the only php file which is used to handle the user session and respond the client ajax reuqest
The index.html file is the entrance file
The js/web-test.js is the javascript file used to get the data from the server and populate the data into the html page
The scss/web-test.scss is the main scss file and _mixins.scss is the mixins definition, where all the styling code resides, which generate css/web-test.css file using scss tools

CSS and Html Breakdown
----------------------------
Standard bootstrap form is used for the search form
Html Flexbox is used to arrange the search results and the recommendations
Bootstrap grid is implemented to display the recent search words

JS Breakdown
----------------------------
VideoPager is a JS object used as the pagination
The JS classes named DataItemVideoConverter and AjaxVideoQuerier are used to get the searching videos and recommendations asynchronously from the server and convert the server data to html elements
The JS function called fill_recent_search_html gets the recent searches from the server and fill the corresponding html section
The code in the JQuery onload callback initializes the html page and adds the events

