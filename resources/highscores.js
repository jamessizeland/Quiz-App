const highScoresList = document.getElementById('highScoresList');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

//create html li elements from this array of scores. Map takes an array of items and converts it to something else, element by element. Join it to make it a string, write it to innerHTML to add it to the webpage.
highScoresList.innerHTML = highScores.map( score => {
    return '<li class="high-score">' + score.name + '-' + score.score + '</li>';
}).join("");

