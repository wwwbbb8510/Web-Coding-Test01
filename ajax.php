<?php
/**
 * handle the ajax requests
 */

define('YOUTUBE_API_KEY', 'AIzaSyDMEgyECScLdhmGq-YcNFFQ2HFawNstPCw');
error_reporting(0);
if(isset($_REQUEST['action'])){
    $str_return = '';
    switch ($_REQUEST['action']){
        case 'search' : 
            $str_return = get_youtube_results();
            break;
        case 'recommend' : 
            $str_return = get_recomendations();
            break;  
        case 'recent' :
            $str_return = get_recent_searches();
            break;
    }
    echo $str_return;
    exit;
}

/**
 * get youtube results
 */
function get_youtube_results(){
    $query = isset($_REQUEST['query']) ? $_REQUEST['query'] : NULL;
    $page_token = isset($_REQUEST['page_token']) ? $_REQUEST['page_token'] : NULL ;
    $arr_response = array();
    if(!empty($query)){
        $url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' . $query 
            . '&maxResults=5&key='. YOUTUBE_API_KEY;
        $url .= !empty($page_token) ? '&pageToken=' . $page_token : '';
        $str_response = file_get_contents($url);
        $arr_response = json_decode($str_response, TRUE);
        if(isset($arr_response['items']) &&
                is_array($arr_response['items']) &&
                count($arr_response['items']) > 0){
            session_start();
            if(!isset($_SESSION['recent_searches'])){
                $_SESSION['recent_searches'] = array();
            }
            if(($key = array_search($query, $_SESSION['recent_searches'])) !== FALSE){
                unset($_SESSION['recent_searches'][$key]);
            }
            array_unshift($_SESSION['recent_searches'], $query);
            $_SESSION['recent_searches'] = array_slice($_SESSION['recent_searches'], 0, 10);
        }
    }
    
    return json_encode($arr_response);
}

/**
 * get recent searches
 */
function get_recent_searches(){
    session_start();
    $recent_searches = array();
    if(isset($_SESSION['recent_searches']) && is_array($_SESSION['recent_searches'])){
        $recent_searches = array_slice($_SESSION['recent_searches'], 0, 5);
    }
    return json_encode($recent_searches);
}

/**
 * get recomended videos
 */
function get_recomendations(){
    session_start();
    $arr_response = array();
    if(isset($_SESSION['recent_searches']) && is_array($_SESSION['recent_searches'])){
        if(isset($_REQUEST['query']) && $_REQUEST['query'] != NULL){
            $most_recent_search = $_SESSION['recent_searches'][1];
        }else{
            $most_recent_search = $_SESSION['recent_searches'][0];
        }
        if(!empty($most_recent_search)){
            $url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' . $most_recent_search 
                . '&maxResults=5&key='. YOUTUBE_API_KEY;
            $str_response = file_get_contents($url);
            $arr_response = json_decode($str_response, TRUE);
        }
    }
    return json_encode($arr_response);
}
