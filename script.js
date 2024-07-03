function parseSequences(input) {
    const sequences = input.trim().split('\n').map(seq => seq.trim().split(',').map(el => el.trim()));
    return sequences;
}

function buildTransitionMatrix(sequences) {
    const transitionMatrix = {};

    sequences.forEach(sequence => {
        for (let i = 0; i < sequence.length - 1; i++) {
            const current = sequence[i];
            const next = sequence[i + 1];

            if (!transitionMatrix[current]) {
                transitionMatrix[current] = {};
            }
            if (!transitionMatrix[current][next]) {
                transitionMatrix[current][next] = 0;
            }
            transitionMatrix[current][next]++;
        }
    });

    // Convert counts to probabilities
    for (let current in transitionMatrix) {
        let total = Object.values(transitionMatrix[current]).reduce((acc, val) => acc + val, 0);
        for (let next in transitionMatrix[current]) {
            transitionMatrix[current][next] /= total;
        }
    }

    return transitionMatrix;
}

function chooseNextElement(currentElement, transitionMatrix) {
    const probabilities = transitionMatrix[currentElement];
    if (!probabilities) {
        return null;
    }

    const randomValue = Math.random();
    let cumulativeProbability = 0;

    for (let element in probabilities) {
        cumulativeProbability += probabilities[element];
        if (randomValue < cumulativeProbability) {
            return element;
        }
    }
    return null; // Fallback in case something goes wrong
}

function generateRandomSequence(transitionMatrix, startElement, length) {
    let sequence = [startElement];
    let currentElement = startElement;

    for (let i = 1; i < length; i++) {
        currentElement = chooseNextElement(currentElement, transitionMatrix);
        if (currentElement === null) {
            break; // Stop if there are no transitions available
        }
        sequence.push(currentElement);
    }

    return sequence;
}

function generateSequence() {
    const input = document.getElementById('inputSequences').value;
    const sequences = parseSequences(input);

    if (sequences.length === 0 || sequences[0].length === 0) {
        document.getElementById('outputSequence').innerText = 'Please enter valid sequences.';
        return;
    }

    const transitionMatrix = buildTransitionMatrix(sequences);

    // Randomly choose a starting element from the input sequences
    const allElements = sequences.flat();
    const startElement = allElements[Math.floor(Math.random() * allElements.length)];

    // Get the specified max sequence length from user input
    const sequenceLengthInput = document.getElementById('sequenceLength').value;
    const sequenceLength = sequenceLengthInput ? parseInt(sequenceLengthInput, 10) : 10; // Default to 10 if no input

    const newSequence = generateRandomSequence(transitionMatrix, startElement, sequenceLength);

    document.getElementById('outputSequence').innerText = newSequence.join(', ');
}
