
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