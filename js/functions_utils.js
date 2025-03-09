
// Fonction pour générer une couleur aléatoire
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// Fonction pour ouvrir la page des paramètres
function openSettings() {
    window.location.href = 'settings.html'; // Redirection vers la page des paramètres
}


function rssiToPercentage(rssi) {
    const maxRssi = -20;
    const minRssi = -100;
    if (rssi > maxRssi) rssi = maxRssi;
    if (rssi < minRssi) rssi = minRssi;
    return ((rssi - minRssi) / (maxRssi - minRssi)) * 100;
}


function getBatteryLevelIcon(deviceName, batteryStatus, isCharging) {
    const level = parseInt(batteryStatus);
    let iconPath;
    // console.log(deviceName, batteryStatus, isCharging, level)
    if (isCharging) {
        if (isNaN(level)) {
            iconPath = 'icones/Bat-0.png';
        } else if (level <= 10) {
            iconPath = 'icones/Bat0-10.gif';
        } else if (level <= 20) {
            iconPath = 'icones/Bat0-25.gif';
        } else if (level <= 25) {
            iconPath = 'icones/Bat0-25.gif';
        } else if (level <= 40) {
            iconPath = 'icones/Bat25-50.gif';
        } else if (level <= 50) {
            iconPath = 'icones/Bat40-50.gif';
        } else if (level <= 60) {
            iconPath = 'icones/Bat40-50.gif';
        } else if (level <= 70) {
            iconPath = 'icones/Bat40-50.gif';
        } else if (level <= 80) {
            iconPath = 'icones/Bat40-50.gif';
        } else if (level < 100) {
            iconPath = 'icones/Bat80-100.gif';
        } else {
            iconPath = 'icones/Bat100.gif';
        }
    }
    else {
        if (isNaN(level)) {
            iconPath = 'icones/Bat-0.png';
        } else if (level <= 10) {
            iconPath = 'icones/Bat0-10.png';
        } else if (level <= 20) {
            iconPath = 'icones/Bat10-20.png';
        } else if (level <= 25) {
            iconPath = 'icones/Bat20-25.png';
        } else if (level <= 40) {
            iconPath = 'icones/Bat25-40.png';
        } else if (level <= 50) {
            iconPath = 'icones/Bat40-50.png';
        } else if (level <= 60) {
            iconPath = 'icones/Bat50-60.png';
        } else if (level <= 70) {
            iconPath = 'icones/Bat60-70.png';
        } else if (level <= 80) {
            iconPath = 'icones/Bat70-80.png';
        } else if (level < 100) {
            iconPath = 'icones/Bat80-100.png';
        } else {
            iconPath = 'icones/Bat100.png';
        }
    }
    return `<img src="${iconPath}" alt="Battery Icon"  class="icon" id="icon-${deviceName}" onclick="clickDeviceIcon('${deviceName}')">`;
}



// Fonction pour cliquer sur l'icône du dispositif
async function clickDeviceIcon(deviceName) {
    const icon = document.getElementById(`icon-${deviceName}`);
    const originalSrc = icon.src;
    icon.src = 'icones/loading.gif';
    const pingRes = await sendCommandAndWaitForResponse(deviceName, 'ping');
    const batteryRes = await sendCommandAndWaitForResponse(deviceName, 'batteryStatus');
    deviceStates[deviceName].online = pingRes !== 'Timeout';
    updateMessage(deviceName, new Date().toTimeString().split(' ')[0]);

}

// Fonction pour cliquer sur l'icône WiFi du dispositif
async function clickDeviceWifiIcon(deviceName) {
    const icon = document.getElementById(`wifiicon-${deviceName}`);
    const originalSrc = icon.src;
    icon.src = 'icones/loading.gif';
    const wifiRes = await sendCommandAndWaitForResponse(deviceName, 'wifiInfo');
}
