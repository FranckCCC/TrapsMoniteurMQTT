<?php
$filePath = '../Datas/config.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jsonInput = file_get_contents('php://input');
    $data = json_decode($jsonInput, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "Error in incoming JSON\n";
        exit;
    }

    // Read existing data
    if (file_exists($filePath)) {
        $jsonData = json_decode(file_get_contents($filePath), true);
    } else {
        $jsonData = ["config" => []];
    }

    // Update and save data
    $jsonData['config'] = array_merge($jsonData['config'], $data);
    file_put_contents($filePath, json_encode($jsonData, JSON_PRETTY_PRINT));
    echo "Data saved successfully";
} else {
    echo "Invalid request method";
}
?>
