const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progress-text');
const scoreText = document.getElementById('score');
const progressBar = document.getElementById('progress-bar-full');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = []; 

let questions = [];

//this is a promise - we are replacing it with a more sophisticated one that calls from an API rather than from a local file.
/* fetch("resources/questions.json")
    .then( res => {
        console.log(res);
        return res.json();
    }).then(loadedQuestions => {
        console.log(loadedQuestions);
        questions = loadedQuestions;
        
    })
    .catch(err => { //very basic error handler
        console.log(err);
    }); */
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        questions = loadedQuestions.results.map( loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random()*3)+1; //set correct answer at a random position in the potential answers.
            answerChoices.splice(formattedQuestion.answer-1, 0, loadedQuestion.correct_answer);

            answerChoices.forEach((choice, index) =>{
                formattedQuestion["choice" + (index+1)] = choice;
            })
            return formattedQuestion;
        });
        startGame();
    });

// CONSTANTS
const correctBonus = 10;
const maxQuestions = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]; // make a copy of the questions array into the availableQuestions array, without tying them to the same memory space using the ... spread operator.
    console.log(availableQuestions);
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};


getNewQuestion = () => {

    if(availableQuestions.length === 0 || questionCounter >= maxQuestions){
        localStorage.setItem('mostRecentScore', score);
        //Go to the end page
        return window.location.assign("/end.html");
    }
    questionCounter++;
    progressText.innerText = 'Question '+ questionCounter + '/' + maxQuestions;
    //update the progress bar
    progressBar.style.width = ((questionCounter / maxQuestions)*100 + '%');
    const questionIndex = Math.floor(Math.random()*availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number']; // access custom attribute like this
        choice.innerText = currentQuestion['choice' + number];
    });
    availableQuestions.splice(questionIndex, 1); // remove element from array
    acceptingAnswers = true;
};


choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        if (classToApply === 'correct') {
            incrementScore(correctBonus);
        }
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);

    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

