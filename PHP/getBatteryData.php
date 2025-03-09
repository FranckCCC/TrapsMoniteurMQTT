<?php

$filePath = '../Datas/batteryData.json';

// Vérifier si le fichier existe ; sinon, le créer avec un objet JSON vide
if (!file_exists($filePath)) {
    file_put_contents($filePath, "{}");
    echo 'Fichier créé';
    exit; // Assurez-vous de sortir ici pour éviter les erreurs de fichier inexistant ci-dessous
}

// Lire le contenu du fichier JSON
$data = json_decode(file_get_contents($filePath), true);

// S'il y a eu une erreur lors de la décodification du JSON, on initialise les données à vide
if (!is_array($data)) {
    $data = [];
}

// Renvoyer toutes les données en format JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
