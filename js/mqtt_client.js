
async function connectAndSubscribe() {

    if (client && client.connected) {
        console.log("Client MQTT déjà connecté.");
        return;
    }
    const brokerUrl = `ws://${localStorage.getItem('mqttServerAddress')}:${localStorage.getItem('mqttServerPort')}`;
    const devices = JSON.parse(localStorage.getItem('mqttDevices')) || [];
    client = mqtt.connect(brokerUrl);
    client.setMaxListeners(0);
    let firstMessageReceived = false; // Ajout d'un indicateur pour le premier message


    devices.forEach(device => {
        deviceStates[device.name] = {
            batteryStatus: undefined,
            chargingStatus: undefined,
            online: false,
            wifi: {
                ssid: undefined,
                bssid: undefined,
                ip: undefined,
                level: undefined,
                rssi: undefined
            }
        };

        client.subscribe(`devices/#`);
        client.subscribe(`battery/#`);
        client.subscribe(`charging/#`);
        client.subscribe(`wifi/#`);
    });

    console.log(deviceStates)

    // Callback pour les messages reçus
    client.on('message', (topic, message) => {
        if (!firstMessageReceived) {
            document.getElementById('mqttMessages').innerHTML = ''; // Supprime le message d'attente
            firstMessageReceived = true; // Mise à jour de l'indicateur
        }
        const messageContent = message.toString();
        const [type, deviceName] = topic.split('/');
        const now = new Date();
        const timestamp = now.toTimeString('fr-FR', { timeZone: 'Europe/Paris' }).split(' ')[0]; // Format HH:mm:ss

        // console.log(`Message reçu: ${messageContent} pour le topic ${topic}, ${type}`);


        // Comme on est abonné à tous les topics, on vérifie si le dispositif est connu
        if (!deviceStates[deviceName]) {

            const unknownDevices = JSON.parse(localStorage.getItem('unknownDevices')) || [];
            if (!unknownDevices.includes(deviceName)) {
                unknownDevices.push(deviceName);
                localStorage.setItem('unknownDevices', JSON.stringify(unknownDevices));
            }

            console.log(`Dispositif inconnu: ${deviceName}`);
            return;
        }

        if (type === 'devices') {
            deviceStates[deviceName].online = messageContent === 'Connected';
        }

        if (type === 'battery') {
            deviceStates[deviceName].batteryStatus = `${messageContent}%`;
            saveBatteryData(deviceName, messageContent);

            addValueToChart(deviceName, messageContent);
      
        }

        if (type === 'charging') {
            deviceStates[deviceName].chargingStatus = (messageContent.toLowerCase() === 'true') ? 'en charge' : 'n\'est actuellement pas en charge';
        }

        if (type === 'wifi') {
            const wifiInfo = JSON.parse(messageContent);
        
            let wifiLevel = wifiInfo.rssi < -98 ? 0 : wifiInfo.rssi < -90 ? 1 : wifiInfo.rssi < -70 ? 2 : wifiInfo.rssi < -50 ? 3 : wifiInfo.rssi < -30 ? 4 : 5

            deviceStates[deviceName].wifi = {
                ssid: wifiInfo.ssid,
                bssid: wifiInfo.bssid,
                ip: wifiInfo.ip,
                level: wifiLevel,
                rssi: wifiInfo.rssi,
                mac: wifiInfo.mac
            };

        }
        // Correspondance entre les adresses MAC et les noms des APs

         if (deviceStates[deviceName].wifi.bssid === '24:a4:3c:d0:a0:d2') {
            apNamesByMac = 'AP01';
            deviceStates[deviceName].wifi.apName = 'AP01';
        } else if (deviceStates[deviceName].wifi.bssid === '68:72:51:44:5c:d2') {
            apNamesByMac = 'AP02';
            deviceStates[deviceName].wifi.apName = 'AP02';
         } else if (deviceStates[deviceName].wifi.bssid === '68:72:51:78:dd:b7') {
            apNamesByMac = 'AP03';
            deviceStates[deviceName].wifi.apName = 'AP03';
         } else if (deviceStates[deviceName].wifi.bssid === '68:72:51:7a:5c:1F') {
            apNamesByMac = 'AP04';
            deviceStates[deviceName].wifi.apName = 'AP04';
         } else {
            apNamesByMac = 'AP inconnue';
            deviceStates[deviceName].wifi.apName = 'AP inconnue';
         }

        deviceStates[deviceName].wifi.apName = getApNameByMac(deviceStates[deviceName].wifi.bssid);

        // Callback pour la connexion
        client.on('connect', function () {
            console.log('Connecté au serveur MQTT');
            pingAllDevices(); // Assurez-vous que cette fonction est appelée après la connexion
        });

        function getApNameByMac(mac) {
            // Récupérer les infos depuis localStorage
            const apsInfo = JSON.parse(localStorage.getItem('aps') || '[]');

            // Trouver l'AP par son adresse MAC
            const ap = apsInfo.find(ap => ap.mac == mac);
            return ap ? ap.name : 'AP inconnue'; // Retourne le nom de l'AP ou 'AP inconnue'
        }

        //  let apName = apNamesByMac[deviceStates[deviceName].wifi.bssid];
        updateMessage(deviceName, timestamp);

    });

    pingAllDevices();

}


// Fonction pour se connecter au broker MQTT
function sendGlobalMessage() {
    const devices = JSON.parse(localStorage.getItem('mqttDevices')) || [];
    const messageText = document.getElementById("globalMessageText").value;

    if (!messageText.trim()) {
        console.log("Le message global ne peut pas être vide");
        return;
    }
    devices.forEach(device => {
        sendCommand(device.name, 'ping');

        const topic = `notifs/${device.name}`;
        if (client && client.connected) {
            client.publish(topic, messageText, (error) => {
                if (error) {
                    console.error(`Erreur lors de l'envoi du message global à ${device.name}`, error);
                } else {
                    console.log(`Message global envoyé à ${device.name}`);
                }
            });
        } else {
            console.log("Client MQTT n'est pas connecté.");
        }
    });

}

// Fonction pour se connecter au broker MQTT
function sendMessageToDevice(index) {
    // Vérifie si le client MQTT est déjà initialisé et connecté
    if (!client || !isClientConnected) {
        connect(() => sendToDeviceAfterConnect(index)); // Connecte et défini un callback pour l'envoi
    } else {
        // Si déjà connecté, envoie le message directement
        sendToDeviceAfterConnect(index);
    }
}

// Fonction pour envoyer un message à un dispositif après la connexion
function sendToDeviceAfterConnect(index) {
    const nameInput = document.getElementsByClassName('device-name')[index];
    const messageInput = document.getElementsByClassName('device-message')[index];
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        console.log("Le nom du dispositif et le message ne peuvent pas être vides.");
        return;
    }

    const topic = `notifs/${name}`;
    const mqttMessage = new Paho.MQTT.Message(message);
    mqttMessage.destinationName = topic;
    client.send(mqttMessage);
    console.log(`Message envoyé au topic: ${topic} avec le message: ${message}`);
}



function sendCommand(deviceName, command) {
    const client = mqtt.connect(`ws://${localStorage.getItem('mqttServerAddress')}:${localStorage.getItem('mqttServerPort')}`);

    return new Promise((resolve, reject) => {
        try {
            client.publish(`cmd/${deviceName}`, JSON.stringify({ cmd: command }));
            resolve();
        } catch (error) {
            reject(error);
        }
        // client.publish(`cmd/${deviceName}`, JSON.stringify({ cmd: command }));
        // resolve();
    });
}