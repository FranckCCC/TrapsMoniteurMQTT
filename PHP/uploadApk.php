<?php

// Dans le body: form-data qui contient file, et fileName

// Si le dossier n'existe pas, le créer
if (!file_exists('apks')) {
    mkdir('apks', 0777, true);
}

// if (!isset($_FILES['file']) || !isset($_POST['fileName'])) {
//     echo "Erreur : Veuillez fournir un fichier et un nom de fichier";
//     exit;
// }
if ($_FILES["file"]["error"] > 0) {
    echo "Erreur : " . $_FILES["file"]["error"] . "<br>";
} else {

    $fileName = $_POST['fileName'];
    $overwrite = true;
    // if (isset($_POST['overwrite'])) {
    //     $overwrite = $_POST['overwrite'] === 'true';
    // }
    if (file_exists("apks/" . $fileName) && !$overwrite) {
        echo "file_exists";
    } else {
        move_uploaded_file($_FILES["file"]["tmp_name"], "apks/" . $fileName);
        echo "success";
    }
}


// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     if (isset($_FILES['file']) && isset($_POST['fileName'])) {
//         $file = $_FILES['file'];
//         $fileName = $_POST['fileName'];
//         $filePath = 'uploads/' . $fileName;
        
//         if (move_uploaded_file($file['tmp_name'], $filePath)) {
//             echo "Fichier sauvegardé avec succès";
//         } else {
//             echo "Erreur lors de la sauvegarde du fichier";
//         }
//     } else {
//         echo "Veuillez fournir un fichier et un nom de fichier";
//     }
// } else {
//     echo "Seules les requêtes POST sont acceptées";
// }
?>
