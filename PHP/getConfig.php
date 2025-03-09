<?php
$filePath = '../Datas/config.json';

if (file_exists($filePath)) {
    $jsonData = json_decode(file_get_contents($filePath), true);
    echo json_encode($jsonData);
} else {
    echo json_encode(["error" => "Config file not found"]);
}
?>
