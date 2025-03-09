<?php
date_default_timezone_set('Europe/Paris'); // Définir le fuseau horaire sur Europe/Paris

$cheminFichier = '../Datas/batteryData.json';

// Vérifier si le fichier existe ; sinon, le créer avec un objet JSON vide
if (!file_exists($cheminFichier)) {
    file_put_contents($cheminFichier, "{}");
    echo 'Fichier créé';
    exit; // Assurez-vous de sortir ici pour éviter les erreurs de fichier inexistant ci-dessous
}

// Valider si le contenu du fichier existant est un JSON valide
$donneesJson = json_decode(file_get_contents($cheminFichier), true);
if ($donneesJson === null) {
    echo 'Le fichier n\'est pas un JSON valide. Remplacement par un objet vide.';
    file_put_contents($cheminFichier, "{}");
    exit; // Sortir pour éviter de poursuivre avec des données invalides
}

// Récupérer les données POST
$entreeJson = file_get_contents('php://input');
$donnees = json_decode($entreeJson, true);

// Vérifier les données reçues et utiliser des valeurs par défaut si nécessaire
$deviceName = $donnees['deviceName'] ?? 'testDevice';
$batteryPercentage = $donnees['batteryPercentage'] ?? 100;

// Ajouter ou mettre à jour les données seulement si elles sont différentes de la dernière valeur enregistrée pour cet appareil
$deviceData = $donneesJson[$deviceName] ?? [];
$lastEntry = end($deviceData);

if ($lastEntry !== $batteryPercentage) {
    // Si le pourcentage de batterie est différent, mettez à jour le fichier
    $timestamp = date('Y-m-d H:i'); // Arrondir à la minute la plus proche pour l'homogénéité
    $donneesJson[$deviceName][$timestamp] = $batteryPercentage;

    // Écrire le tableau mis à jour dans le fichier
    file_put_contents($cheminFichier, json_encode($donneesJson, JSON_PRETTY_PRINT));
    echo "Données enregistrées pour $deviceName à l'horodatage $timestamp avec $batteryPercentage% de batterie.\n";
} else {
    echo "Aucune nouvelle donnée à enregistrer pour $deviceName.\n";
}
?>
