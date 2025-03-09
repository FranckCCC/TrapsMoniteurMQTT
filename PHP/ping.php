<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Scan du réseau</title>
</head>
<body>
    <h2>Scan du réseau</h2>

    <!-- Champ pour saisir l'IP d'un PC -->
    <div>
        <label for="pcIp">Adresse IP du PC :</label>
        <input type="text" id="pcIp" class="pc-ip" name="pcIp">
    </div>
    <!-- Répétez le bloc ci-dessus pour chaque PC que vous souhaitez scanner -->

    <button onclick="pingAllPcs()">Lancer le Scan</button>
    <div id="results"></div>

    <script>
    function pingAllPcs() {
        const pcs = document.querySelectorAll('.pc-ip');
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Vider les résultats précédents

        pcs.forEach((pc) => {
            const ipAddress = pc.value;
            if (ipAddress) {
                fetch(`pingScript.php?ip=${ipAddress}`) // Assurez-vous que le chemin est correct
                    .then(response => response.json())
                    .then(data => {
                        console.log(`${data.ip} est ${data.status ? 'en ligne' : 'hors ligne'}`);
                        // Mise à jour de l'interface utilisateur selon le statut
                        resultsDiv.innerHTML += `<p>${data.ip} est ${data.status ? 'en ligne' : 'hors ligne'}</p>`;
                    })
                    .catch(error => console.error('Erreur lors du ping:', error));
            }
        });
    }
    </script>
</body>
</html>
