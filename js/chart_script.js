// Déclaration de la variable globale pour référencer le graphique de la batterie
var batteryChart;

var minutes;
var datasetsByDevices = {};


// envoi de données vers php

function saveBatteryData(deviceName, batteryPercentage) {
    const data = { deviceName, batteryPercentage };
    
    let timeMinute = new Date(new Date().toISOString()).toISOString().slice(0, 16);
    // console.log(timeMinute);
    data.timestamp = timeMinute;

    fetch('PHP/saveBatteryData.php', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        // .then(data => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });
}


// Fonction pour initialiser ou mettre à jour le graphique de la batterie
function createOrUpdateBatteryChart(rawData) {
    const ctx = document.getElementById('batteryChart').getContext('2d');
    // console.log('Création ou mise à jour du graphique de la batterie avec les données:', rawData);
    if (batteryChart && hasDataChanged(batteryChart.data.datasets, rawData.datasets)) {
        // Mise à jour seulement si les données ont changé
        batteryChart.data = rawData;
        batteryChart.update();
    } else if (!batteryChart) {
        const data = rawData;
        batteryChart = new Chart(ctx, {
            type: 'line',
            data: rawData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value, index, values) {
                                return value + '%';  // Ajoute un '%' après chaque valeur de l'axe Y
                            }
                        }
                    }
                },
                /*tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            let label = data.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += tooltipItem.yLabel + '%';
                            return label;
                        }
                    }
                }*/
            }
        });
    }
}

// Improved data aggregation logic
function aggregateDataAndCheck(deviceName, newValue) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getMinutes() % 50); // round to nearest 10-minute mark
    const roundedTime = now.toISOString();

    if (!aggregatedData[roundedTime]) {
        aggregatedData[roundedTime] = {};
    }

    const existing = aggregatedData[roundedTime][deviceName];
    if (existing) {
        existing.values.push(newValue);
        existing.average = existing.values.reduce((a, b) => a + b, 0) / existing.values.length;
    } else {
        aggregatedData[roundedTime][deviceName] = { values: [newValue], average: newValue };
    }

    // Update chart only if significant change
    if (!existing || Math.abs(existing.average - newValue) > 5) { // threshold to update
        addValueToChart(deviceName, aggregatedData[roundedTime][deviceName].average);
    }
}

function removeConsecutiveDuplicates(data) {
    // Nouvel objet pour conserver les données nettoyées
    const cleanedData = {};

    // Parcourir tous les timestamps
    Object.keys(data).sort().forEach((timestamp, index, array) => {
        cleanedData[timestamp] = {};
        
        // Parcourir tous les dispositifs pour le timestamp courant
        Object.keys(data[timestamp]).forEach(device => {
            // Vérifier si le timestamp courant est le premier ou si la valeur actuelle est différente de la précédente
            if (index === 0 || data[timestamp][device] !== data[array[index - 1]][device]) {
                cleanedData[timestamp][device] = data[timestamp][device];
            }
        });
    });

    return cleanedData;
}

function transformDataForChart(data) {
    // Transforme les données pour correspondre à la structure attendue par le graphique
    const transformedData = {};
    const deviceNames = Object.keys(data);

    deviceNames.forEach(deviceName => {
        Object.keys(data[deviceName]).forEach(timestamp => {
            if (!transformedData[timestamp]) {
                transformedData[timestamp] = {};
            }
            transformedData[timestamp][deviceName] = data[deviceName][timestamp];
        });
    });

    return transformedData;
}

function getBatteryDataAndUpdateChart() {
    // Récupération et traitement des données de la batterie
    fetch('PHP/getBatteryData.php')
        .then(response => response.json())
        .then(data => {
            const transformedData = transformDataForChart(data);
            const cleanedData = removeConsecutiveDuplicates(transformedData);
            minutes = Object.keys(cleanedData).sort();
            // get a list of all minutes ordered
            minutes = Object.keys(cleanedData);
            minutes.sort();

            var mqttDevicesNames = JSON.parse(localStorage.getItem('mqttDevices')) || [];

            datasetsByDevices = {};

            // Initialiser les datasets pour chaque dispositif
            mqttDevicesNames.forEach(device => {
                datasetsByDevices[device.name] = {
                    label: device.name,
                    data: [], // Ici, 'data' est un tableau qui contiendra les pourcentages de batterie
                    borderColor: device.color,
                    fill: false
                };
            });

            // Remplir les datasets avec des données nettoyées
            minutes.forEach(minute => {
                mqttDevicesNames.forEach(device => {
                    if (cleanedData[minute] && cleanedData[minute][device.name] !== undefined) {
                        datasetsByDevices[device.name].data.push(parseInt(cleanedData[minute][device.name]));
                    } else {
                        datasetsByDevices[device.name].data.push(null);
                    }
                });
            });

            const labels = minutes.map(minute => new Date(minute).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }).slice(11));

            const datasets = Object.values(datasetsByDevices).map(deviceData => ({
                ...deviceData,
                spanGaps: true, // Cette option connecte les points sur le graphique même s'il y a des valeurs nulles
            }));

            // Mise à jour ou création du graphique avec les nouvelles données
            createOrUpdateBatteryChart({
                labels,
                datasets
            });
        })
        .catch(error => {
            console.error('Error fetching battery data:', error);
        });
}



// Function to check if data has changed
function hasDataChanged(newData, oldData) {
    return JSON.stringify(newData) !== JSON.stringify(oldData);
}

function addValueToChart(deviceName, batteryPercentage) {
   // console.log('Ajout de la valeur au graphique:', deviceName, batteryPercentage);
    if (batteryChart) {
      
        // Utiliser directement l'heure locale
        let now = new Date();
        let timestamp = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${('0' + now.getDate()).slice(-2)} ${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}`;

        const index = minutes.indexOf(timestamp);
        if (index === -1) {
            minutes.push(timestamp);
            minutes.sort();
        }
        
        if (!datasetsByDevices[deviceName]) {
            datasetsByDevices[deviceName] = {
                label: deviceName,
                data: [],
                borderColor: device.color,
                fill: false
            };
        }

        if (hasDataChanged(batteryPercentage, datasetsByDevices[deviceName].data[index])) {
        datasetsByDevices[deviceName].data[index] = parseInt(batteryPercentage);
        let datasets = Object.keys(datasetsByDevices).map(deviceName => datasetsByDevices[deviceName]);
        setInterval(getBatteryDataAndUpdateChart, 60000);
       //getBatteryDataAndUpdateChart();
   
    } else {
        console.log('No change detected. Data not updated.');
    }
    }
}


