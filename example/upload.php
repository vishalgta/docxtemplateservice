<?php
/**
 * @see http://stackoverflow.com/a/15200804/2723108
 */
if(!isset($argc) || $argc < 4){
    echo "Usage: $argv[0] [url] [docxfilepath] [jsonfilepath] [parsedfilename]";
    exit(1);
}

$target_url = $argv[1];
function curlFile($file_name_with_full_path)
{
    if (function_exists('curl_file_create')) { // php 5.6+
        $cFile = curl_file_create($file_name_with_full_path);
    } else { //
        $cFile = '@' . realpath($file_name_with_full_path);
    }
    return $cFile;
}

$post = array('docxfile' => curlFile($argv[2]),'jsondata'=> curlFile($argv[3]));
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$target_url);
curl_setopt($ch, CURLOPT_POST,1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
$result=curl_exec ($ch);
curl_close ($ch);