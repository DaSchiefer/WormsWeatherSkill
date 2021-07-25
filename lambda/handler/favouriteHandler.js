const lib = require("../helpFunctions.js");

//Handler der aufgerufen wird wenn ein neuer Favorit gespeichert werden soll
exports.FavouriteHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'FavouriteIntent');
    },
    async handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        // Beim Intent übergebenes Wort wird ausgelesen
        const newFavouriteValue = handlerInput.requestEnvelope.request.intent.slots.WeatherData.value;
        // Die bisher gespeicherten Favoriten werden ausgelesen bzw s3Attributes wird ein leeres array übergeben.
        const s3Attributes = await attributesManager.getPersistentAttributes() || {};
        // Abspeichern des Neuen Favoriten 
        s3Attributes[newFavouriteValue] = newFavouriteValue;
        // Hochladen der neuen Favoriten Liste in den persistenten Speicher
        attributesManager.setPersistentAttributes(s3Attributes);
        await attributesManager.savePersistentAttributes();
        // Ausgabe der nun gespeicherten Favoriten
        let speechOutput = "Ihre Favoriten sind nun " + lib.toString(s3Attributes);
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .getResponse();
    }
};
//Handler der aufgerufen wird wenn die bisher gespeicherten Favoriten aufgezählt werden sollen
exports.FavouriteReaderHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'FavouriteReaderIntent');
    },
    async handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        // Die bisher gespeicherten Favoriten werden ausgelesen bzw s3Attributes wird ein leeres array übergeben.
        const s3Attributes = await attributesManager.getPersistentAttributes() || {};
        console.log('s3Attributes is: ', s3Attributes);

        const counter = s3Attributes.hasOwnProperty('counter') ? s3Attributes.counter : 0;

        let speechOutput = "Ihre Favoriten sind " + lib.toString(s3Attributes);
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .getResponse();
    }
};

//Handler der aufgerufen wird wenn ein gespeichertter Favorit gelöscht werden soll
exports.DeleteFavouriteHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DeleteFavouriteIntent');
    },
    async handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        // Beim Intent übergebenes Wort wird ausgelesen
        const valueToDelete = handlerInput.requestEnvelope.request.intent.slots.WeatherData.value;
        // Die bisher gespeicherten Favoriten werden ausgelesen bzw s3Attributes wird ein leeres array übergeben.
        const s3Attributes = await attributesManager.getPersistentAttributes() || {};
        // Löschen des gewünschten Favoriten
        delete s3Attributes[valueToDelete];
        // Abspeichern der nun übrig gebliebenen Favoriten in den persistenten Speicher
        attributesManager.setPersistentAttributes(s3Attributes);
        await attributesManager.savePersistentAttributes();
        let speechOutput = "Ihre Favoriten sind nun " + lib.toString(s3Attributes);
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .getResponse();
    }
};

//Handler der aufgerufen wird wenn alle Favoriten gelöscht werden sollen
exports.DeleteAllFavouriteHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'DeleteAllFavouriteIntent');
    },
    
    async handle(handlerInput) {
        let speechOutput = "Ihre Favoriten wurden nicht gelöscht."
        // Überprüfung ob der Confirmation Intent bestätigt oder abgelehnt wurde
        if(handlerInput.requestEnvelope.request.intent.confirmationStatus !== "DENIED"){
        // wenn die Löschung nicht DENIED wurde, löschung des persitneten Attribut
        const attributesManager = handlerInput.attributesManager
        await attributesManager.deletePersistentAttributes();
        speechOutput = "Ihre Favoriten sind alle gelöscht";}
        
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .getResponse();
    }
};
//Handler der aufgerufen wird wenn die Wetterdaten der gespeicherten Favoriten ausgegeben werden sollen
exports.OutputFavouriteHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'OutputFavouriteIntent');
    },
    async handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager
                // Die bisher gespeicherten Favoriten werden ausgelesen bzw s3Attributes wird ein leeres array übergeben.
        const s3Attributes = await attributesManager.getPersistentAttributes() || {};
        let speechOutput = "Ihr Wetter heute: ";
        let myWeather;
        await lib.getRemoteData()
            .then((response) => {
                myWeather = response;
            })
        // Durchgehen von s3Attributes und Überprüfung welche Favoriten abgespeichert wurden um diese auszugeben
        for (const [key] of Object.entries(s3Attributes)) {

            switch (key) {
                case "temperatur":
                    speechOutput += "Temperatur " + lib.germanNumber(myWeather.temp.out.c) + " Grad Celsius. ";
                    break;
                case "windgeschwindigkeit":
                    speechOutput += "Windgeschwindigkeit " + lib.germanNumber(myWeather.wind.speed.kmh) + " km/h. ";
                    break;
                case "luftfeuchtigkeit":
                    speechOutput += "Luftfeuchtigkeit " + myWeather.hum.out + "%. ";
                    break;
                case "luftdruck":
                   speechOutput += "Luftdruck "+ lib.germanNumber(myWeather.baro, 2) + " hPa. "
            }

        }
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withShouldEndSession(false)
            .getResponse();
    }
};