<?php
error_reporting(0);
$url = isset($_GET['url']) ? $_GET['url'] : NULL;
$url = buildUrl($_REQUEST);
if ($url) {
	$post_comment = false;
	if (isset($_POST['post_type']) && $_POST['post_type']=='comment') {
		$json 	= getCurlResponse($url, $_POST);
		$post_comment = true;
	} else {
		$json	= file_get_contents($url);
	}
	
	$isJson = isJson($json);
	if ($post_comment && !$isJson) {
		ob_start();
		header('Content-type: application/json');
		echo $json;
		$html = ob_get_clean();
		$body = '';
		if (preg_match('/(?:<body[^>]*>)(.*)<\/body>/isU', $html, $matches)) {
			if (!empty($matches[1])) {
				$body = strip_tags($matches[1]);
				$body = trim($body);
			}
		}
		if ($body) {
			$json = array();
			$json['comment'] = false;
			$json['msg'] = $body;
			$json = json_encode($json);
		}
	}
	if($isJson) {
		header('Content-type: application/json');
	} else {
		header('Content-type: text/html');
	}
	echo $json;
} else {
	echo '{"msg":"Request not found"';
}
exit;
function isJson($string)
{return false;
    // try to decode string
    json_decode($string);
 
    // check if error occured
    $isValid = json_last_error() === JSON_ERROR_NONE;
 
    return $isValid;
}
function buildUrl($request)
{
    $url = isset($request['url']) ? $request['url'] : NULL;
	if (!$url) {
		return NULL;
	}
	unset($request['url']);
	$params = '';
	if(!empty($request)) {
		$params = array();
		foreach ($request as $field => $value) {
			$param = $field . '=' . $value;
			$params[] = $param;
		}
		$params = implode("&", $params);
	}
	if (strpos($url, "?")!==false) {
		$url .= '&' . $params;
	} else {
		$url .= '?' . $params;
	}
	return $url;
}
function getCurlResponse($url, $fields)
{
	//url-ify the data for the POST
	$fields_string = '';
	foreach($fields as $key=>$value) { 
		$fields_string .= $key.'='.$value.'&'; 
	}
	rtrim($fields_string, '&');
	
	$conttype	= 'application/json; charset=UTF-8';
	$headers[]	= 'Content-Type: ' . addslashes($conttype);
	
	//open connection
	$ch = curl_init();
	
	//set the url, number of POST vars, POST data
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, count($fields));
	curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	//curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 6; Windows NT 6.1)');
	
	//execute post
	$result = curl_exec($ch);
	$result = rtrim($result, '1');
	
	//close connection
	curl_close($ch);
	return $result;
}
?>