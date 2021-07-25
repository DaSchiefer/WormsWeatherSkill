// Funktion zum Zugriff auf die nötigen APIS( wenn nichts der Funktion übergeben wird, wird die Data API genutzt)
module.exports.getRemoteData = function (art = '') {
    const url = art === 'statistics' 
                ? 'http://wetter2.mt-labor.it.hs-worms.de/api/statistics'
                : 'http://wetter2.mt-labor.it.hs-worms.de/api/data';
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? require('https') : require('http');
        const request = client.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed with status code: ' + response.statusCode));
            }
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => { let text = body.join(''); const data = JSON.parse(text); resolve(data) });
        });
        request.on('error', (err) => reject(err))
    })
};

// Funktion zum umformatieren der Nummern und zur Kürzung der Nachkommestellen
module.exports.germanNumber = function(data, decimals = -1) {
    let text = data.toString();
    if (decimals > -1) {
        const parts = text.split(".");
        return parts[0] + "," + parts[1].substring(0, decimals);
    }
    return text.replace(/\./i, ",");
}
// Funktion zum aneinanderhängen der Attribute eines Objektes zu einem lesbaren String
module.exports.toString = function(obj) {
    let output = "";
    for (let propt in obj) {
        output += propt + " und ";
    }
    return output.substring(0,output.length-5);
}