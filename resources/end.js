const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const maxHighScores = 5;

const highScores = JSON.parse(localStorage.getItem("highScores")) || []; // if the highScores variable is empty, initialize an empty array
console.log(highScores);

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    console.log(username.value);
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    console.log("clicked the save button!");
    e.preventDefault(); // stops the standard behaviour of the form, which is to refresh the page and add the form details to the URL.  We don't want that behaviour right now.

    const score = {
        score: mostRecentScore,
        name: username.value
    };

    // add the latest score value to the end of the array, sort the array into order and then keep only the first 5 values.
    highScores.push(score); 
    highScores.sort( (a,b) => {
        return b.score - a.score;
    }); // this is also expressable as - highScore.sort( (a,b) => b.score - a.score)
    highScores.splice(5);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('/') //go back to index
    
};