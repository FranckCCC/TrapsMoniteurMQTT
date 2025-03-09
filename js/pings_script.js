

// Ping AP
function pingAllAps() {
    // Clear existing content
    const resultsDiv = document.getElementById('apContainer');
    resultsDiv.innerHTML = '<div class="ap-container"></div>';
    const apContainer = resultsDiv.querySelector('.ap-container');

    // Function to ping a single AP
    const pingApAndUpdateUI = (ap) => {
        fetch(`PHP/pingScript.php?ip=${ap.ip}`)
            .then(response => response.json())
            .then(data => {
                let apStatusDiv = apContainer.querySelector(`[data-ip="${ap.ip}"]`);
                if (!apStatusDiv) {
                    apStatusDiv = document.createElement('div');
                    apStatusDiv.className = 'ap-status';
                    apStatusDiv.setAttribute('data-ip', ap.ip);
                    apStatusDiv.innerHTML = `
                        <img src="icones/AP-off.png" alt="Statut">
                        <span class="ap-name">${ap.name}</span>
                        <div class="ap-ip-status">${ap.ip} </div>
                    `;
                    apContainer.appendChild(apStatusDiv);
                }
                apStatusDiv.onclick = function () { pingAp(ap); }; // Ajout de l'événement onclick ici
                const statusIcon = apStatusDiv.querySelector('img');
                const statusText = apStatusDiv.querySelector('.ap-ip-status');
                statusIcon.src = data.status ? 'icones/AP-on.png' : 'icones/AP-off.png';
                // statusText.innerHTML = `${ap.ip}<br>${data.status ? '<span style="color: green;">En ligne</span>' : '<span style="color: red;">Hors ligne</span>'}`;
            })
            .catch(error => console.error('Erreur lors du ping:', error));
    };

    // Ping each AP initially and set an interval for re-pinging
    const aps = JSON.parse(localStorage.getItem('aps')) || [];
    aps.forEach(pingApAndUpdateUI);
    setInterval(() => aps.forEach(pingApAndUpdateUI), 20000); // Adjust the interval as needed
}

// Function to ping an AP
function pingAp(ap) {
    fetch(`PHP/pingScript.php?ip=${ap.ip}`)
        .then(response => response.json())
        .then(data => {
            // Mise à jour de l'UI selon le résultat du ping
            let apStatusDiv = document.querySelector(`.ap-status[data-ip="${ap.ip}"]`);
            const statusIcon = apStatusDiv.querySelector('img');
            const statusText = apStatusDiv.querySelector('.ap-ip-status');
            statusIcon.src = data.status ? 'icones/AP-on.png' : 'icones/AP-off.png';
            //  statusText.innerHTML = data.status ? 'En ligne' : 'Hors ligne';


        })
        .catch(error => {
            console.error('Erreur lors du ping:', error);
            // Ici vous pouvez également mettre à jour l'UI pour montrer que le ping a échoué
        });
}



// Fonction pour pinguer tous les PC
function pingAllPcs() {
    // Clear existing content
    const resultsDiv = document.getElementById('scanResults');
    resultsDiv.innerHTML = '<div class="pc-container"></div>';
    const pcContainer = resultsDiv.querySelector('.pc-container');

    // Function to ping a single PC
    const pingPcAndUpdateUI = (pc) => {
        fetch(`PHP/pingScript.php?ip=${pc.ip}`)
            .then(response => response.json())
            .then(data => {
                let pcStatusDiv = pcContainer.querySelector(`[data-ip="${pc.ip}"]`);
                if (!pcStatusDiv) {
                    pcStatusDiv = document.createElement('div');
                    pcStatusDiv.className = 'pc-status';
                    pcStatusDiv.setAttribute('data-ip', pc.ip);
                    pcStatusDiv.innerHTML = `
                            <img src="icones/serveur-off.png" alt="Statut">
                            <span class="pc-name">${pc.name}</span>
                            <div class="pc-ip-status">${pc.ip} est en attente...</div>
                        `;
                    pcContainer.appendChild(pcStatusDiv);
                }
                pcStatusDiv.onclick = function () { pingPc(pc); }; // Ajout de l'événement onclick ici
                const statusIcon = pcStatusDiv.querySelector('img');
                const statusText = pcStatusDiv.querySelector('.pc-ip-status');
                statusIcon.src = data.status ? 'icones/serveur-on.png' : 'icones/serveur-off.png';
                statusText.innerHTML = `${pc.ip}<br>${data.status ? '<span style="color: green;">En ligne</span>' : '<span style="color: red;">Hors ligne</span>'}`;
            })
            .catch(error => console.error('Erreur lors du ping:', error));
    };

    // Ping each PC initially and set an interval for re-pinging
    const pcs = JSON.parse(localStorage.getItem('pcs')) || [];
    pcs.forEach(pingPcAndUpdateUI);
    setInterval(() => pcs.forEach(pingPcAndUpdateUI), 20000); // Adjust the interval as needed
}

// Function to ping a PC
function pingPc(pc) {
    fetch(`PHP/pingScript.php?ip=${pc.ip}`)
        .then(response => response.json())
        .then(data => {
            // Mise à jour de l'UI selon le résultat du ping
            let pcStatusDiv = document.querySelector(`.ap-status[data-ip="${pc.ip}"]`);
            const statusIcon = apStatusDiv.querySelector('img');
            const statusText = apStatusDiv.querySelector('.ap-ip-status');
            statusIcon.src = data.status ? 'icones/serveur-on.png' : 'icones/serveur-off.png';
            //  statusText.innerHTML = data.status ? 'En ligne' : 'Hors ligne';


        })
        .catch(error => {
            console.error('Erreur lors du ping:', error);
            // Ici vous pouvez également mettre à jour l'UI pour montrer que le ping a échoué
        });
}



// Fonction pour envoyer un ping à tous les dispositifs
function pingAllDevices() {
    const devices = JSON.parse(localStorage.getItem('mqttDevices')) || [];
    devices.forEach(async device    => {
        let ping = await sendCommandAndWaitForResponse(device.name, 'ping');
        sendCommand(device.name, 'batteryStatus');
        if (ping === 'Timeout') {
            console.log(`Le ${device.name} n'a pas répondu au ping.`);
            deviceStates[device.name].online = false;
            deviceStates[device.name].ping = false;
        } else {
            console.log(`Le ${device.name} a répondu au ping.`);
            deviceStates[device.name].online = true;
            deviceStates[device.name].ping = ping;
        }

        // Après: Utilisation d'un timestamp sans secondes
        updateMessage(device.name, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        //updateMessage(device.name, new Date().toTimeString().split(' ')[0]);
    });

}