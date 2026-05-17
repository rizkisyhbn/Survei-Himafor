const storageKey = 'surveyVotingData';
const surveyForm = document.getElementById('surveyForm');
const pollList = document.getElementById('pollList');
const resultList = document.getElementById('resultList');

let surveys = JSON.parse(localStorage.getItem(storageKey) || '[]');

function saveSurveys() {
    localStorage.setItem(storageKey, JSON.stringify(surveys));
}

function renderSurveys() {
    pollList.innerHTML = '';
    resultList.innerHTML = '';

    if (surveys.length === 0) {
        pollList.innerHTML = '<p>Belum ada survey.</p>';
        resultList.innerHTML = '<p>Belum ada hasil voting.</p>';
        return;
    }

    surveys.forEach((survey, surveyIndex) => {
        const pollCard = document.createElement('div');
        pollCard.className = 'poll-card';

        const title = document.createElement('h3');
        title.textContent = survey.title;
        pollCard.appendChild(title);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        survey.options.forEach((option, optionIndex) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = option.label;
            button.addEventListener('click', () => {
                surveys[surveyIndex].options[optionIndex].votes += 1;
                saveSurveys();
                renderSurveys();
            });
            optionsDiv.appendChild(button);
        });

        pollCard.appendChild(optionsDiv);
        pollList.appendChild(pollCard);

        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';

        const resultTitle = document.createElement('h3');
        resultTitle.textContent = survey.title;
        resultCard.appendChild(resultTitle);

        survey.options.forEach(option => {
            const line = document.createElement('div');
            line.className = 'result-line';
            line.textContent = `${option.label}: ${option.votes} suara`;
            resultCard.appendChild(line);
        });

        resultList.appendChild(resultCard);
    });
}

surveyForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = document.getElementById('surveyTitle').value.trim();
    const optionsText = document.getElementById('surveyOptions').value.trim();

    if (!title || !optionsText) return;

    const options = optionsText
        .split(',')
        .map(item => item.trim())
        .filter(item => item)
        .map(label => ({ label, votes: 0 }));

    if (options.length === 0) return;

    surveys.push({ title, options });
    saveSurveys();
    surveyForm.reset();
    renderSurveys();
});

renderSurveys();