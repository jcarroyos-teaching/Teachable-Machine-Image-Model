function handleChasquidoPrediction(probability) {
    if (probability > 0.8) {
        const bolita = document.querySelector('.bolita');
        bolita.classList.add('jump');
        setTimeout(() => bolita.classList.remove('jump'), 500);
    }
}

function handleAplausosPrediction(score) {
    if (score > 0.75) {
        const truenoElement = document.querySelector('.trueno');
        truenoElement.style.display = 'block';
        truenoElement.classList.add('growAndDisappear');
        setTimeout(() => {
            truenoElement.style.display = 'none';
            truenoElement.classList.remove('growAndDisappear');
        }, 1000);
    }
}

function savePredictionToLocalStorage(classPrediction) {
    let predictions = JSON.parse(localStorage.getItem('predictions')) || [];
    const timestamp = new Date().toLocaleTimeString('es-ES', { hour12: false });
    const formattedPrediction = classPrediction.replace(/: /g, ',').replace(/ /g, '_');
    predictions.push(`${timestamp}, ${formattedPrediction}`);
    localStorage.setItem('predictions', JSON.stringify(predictions));
}

function generateCSV() {
    let predictions = JSON.parse(localStorage.getItem('predictions')) || [];
    let csvContent = "data:text/csv;charset=utf-8,";
    predictions.forEach(prediction => {
        csvContent += prediction + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "predictions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

let recognizer;

async function init() {
    recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels
    const labelContainer = document.getElementById("label-container");
    for (let i = 0; i < classLabels.length; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    recognizer.listen(result => {
        const scores = result.scores; // probability of prediction for each class
        // render the probability scores per class
        for (let i = 0; i < classLabels.length; i++) {
            const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
            console.log(classPrediction);
            savePredictionToLocalStorage(classPrediction);
            if (classLabels[i] === "chasquido") {
                handleChasquidoPrediction(result.scores[i]);
            } else if (classLabels[i] === "aplausos") {
                handleAplausosPrediction(result.scores[i]);
            }
        }
    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    // Stop the recognition in 5 seconds.
    // setTimeout(() => recognizer.stopListening(), 5000);
}

function stopListening() {
    if (recognizer) {
        recognizer.stopListening();
    }
}