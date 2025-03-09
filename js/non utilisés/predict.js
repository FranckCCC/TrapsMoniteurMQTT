let batteryLevels = {}; // Stocke les niveaux de batterie pour chaque dispositif

// Fonction pour prédire le temps de charge ou de décharge complet
function predictBatteryTime(deviceName, newBatteryLevel) {
    if (!batteryLevels[deviceName]) {
        batteryLevels[deviceName] = []; // Initialise le tableau si ce n'est pas déjà fait
    }

    // Convertit le niveau de batterie en entier et l'ajoute au tableau
    batteryLevels[deviceName].push(parseInt(newBatteryLevel, 10));
    
    // Affiche l'état actuel des données pour le diagnostic
    console.log(`État actuel des données pour ${deviceName}: `, batteryLevels[deviceName]);

    const data = batteryLevels[deviceName];
    // Vérifie si suffisamment de données sont collectées pour faire une prédiction
    if (data.length < 5) {
        return { full: "Données insuffisantes", empty: "Données insuffisantes" };
    }

    // Calcule le taux moyen de changement de la batterie
    let totalChange = 0;
    for (let i = 1; i < data.length; i++) {
        totalChange += data[i] - data[i - 1];
    }
    const averageRate = totalChange / (data.length - 1);

    // Détermine le temps nécessaire pour atteindre 100% ou 0%
    let minutesToFull = 0;
    let minutesToEmpty = 0;
    if (averageRate > 0) {
        minutesToFull = (100 - data[data.length - 1]) / (averageRate / 60); // Temps pour être plein en minutes
    } else if (averageRate < 0) {
        minutesToEmpty = data[data.length - 1] / (Math.abs(averageRate) / 60); // Temps pour être vide en minutes
    }

    // Formate les temps en chaîne de caractères lisible
    return {
        full: minutesToFull > 0 ? new Date(Date.now() + minutesToFull * 60000).toLocaleTimeString() : "N/A",
        empty: minutesToEmpty > 0 ? new Date(Date.now() + minutesToEmpty * 60000).toLocaleTimeString() : "N/A"
    };
}

// Exporte la fonction pour l'utiliser dans d'autres fichiers
export { predictBatteryTime };
