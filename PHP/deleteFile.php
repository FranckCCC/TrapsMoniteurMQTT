<?php
$originalPath = '../Datas/batteryData.json';
$backupDirectory = '../Datas/backups/';  // Assurez-vous que ce répertoire existe et est accessible en écriture
$backupFilename = 'backup_' . date('Y-m-d_H-i-s') . '.json'; // Formatage de la date pour rendre le nom de fichier unique

if (file_exists($originalPath)) {
    if (!is_dir($backupDirectory)) {
        mkdir($backupDirectory, 0777, true); // Crée le répertoire de sauvegarde s'il n'existe pas
    }
    $backupPath = $backupDirectory . $backupFilename;
    if (copy($originalPath, $backupPath)) {
        echo "Une copie de sauvegarde du fichier a été créée sous : $backupPath.\n";
        unlink($originalPath); // Supprime le fichier original
        echo "Le fichier original a été supprimé.";
    } else {
        echo "Erreur lors de la création de la copie de sauvegarde.";
    }
} else {
    echo "Le fichier $originalPath n'existe pas.";
}
?>
