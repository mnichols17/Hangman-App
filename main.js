let correct = 0;
let wrongCount = 0;
let wins = 0;

// Creates a new game
document.getElementById('newGame_button').onclick = function(){
  document.getElementById("newGame").setAttribute('hidden',true);
  document.getElementById('guessString').style.color = "#18EA7E";
  $('.btn-light').prop('disabled',false);
  var buttons = document.getElementsByClassName('btn-light');
  for(button of buttons){button.style.background = "white";}
  correct = 0;
  wrongCount = 0;
  getWord();
};

// Gets the word that the user will guess
function getWord(){
  let xhr = new XMLHttpRequest();
  const url = "https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=ab0d5274c4e036127a40d059f3c06ea27056d56b0e0300d75"
  xhr.open('GET',url,true);

  xhr.onload = function(){
    if(this.status == 200){
      let data = JSON.parse(this.responseText);
      console.log(data);
      if(checkWord(data["word"])){
        playGame(data["word"]);
      } else {
        getWord();
      }
    }
    else {
      console.log("Connection Error");
    }
  }
  xhr.send();
}

// The game being played
function playGame(word){
  document.getElementById('panel_1').innerHTML = `<h1>${wrongCount}</h1>`;
  let wordArray = word.toUpperCase().split("");
  let guessArray = [];
  for(let i in word){
    guessArray.push("_");
  }
  setGuess(guessArray);
  var letters = document.getElementsByClassName('btn-light');
  for(let letter of letters){
    letter.onclick = function(){
      letter.disabled = true;
      let guess = this.firstChild.nodeValue;
      if(word.toUpperCase().indexOf(guess) > -1){
        checkGuess(guess, wordArray, guessArray)
        this.style.background = "aqua";
      } else {
        this.style.background = "red";
        wrongCount++;
      }
      document.getElementById('panel_1').innerHTML = `<h1>${wrongCount}</h1>`;
      if(correct == wordArray.length){endGame(true, word);}
      else if(wrongCount >= 7) {endGame(false, word);}
    }
  }
}

// Checks if the word is valid and playable
function checkWord(word){
  if(word.length > 12){return false;}
  let badChars = [" ","-",",",".","/"];
  for(let char of badChars){
    if(word.indexOf(char) > -1){return false;}
  }
  return true;
}

// Checks if the guessed letter is in the word
function checkGuess(guess, wordArray, guessArray){
  for(let i in wordArray){
    if(wordArray[i] == guess){
      guessArray[i] = guess;
      correct++;
    }
  }
  setGuess(guessArray);
}

// Places correctly guessed letters into the correct spaces
function setGuess(guessArray){
  let output = "";
  for(let char of guessArray){ output += char + " ";}
  document.getElementById('guessString').innerHTML = `${output}`;
}

// Called when the game is over. 'New Game' button is now visible
function endGame(result, word){
  $('.btn-light').prop('disabled',true);
  document.getElementById("newGame").removeAttribute('hidden');
  if(result){
    document.getElementById('panel_1').innerHTML = `<h1>You won!</h1>`;
    wins++;
    document.getElementById('winCount').innerHTML = `Win Count: ${wins}`;
  } else {
    document.getElementById('panel_1').innerHTML = `<h1>You lost!</h1>`;
    document.getElementById('guessString').innerHTML = `${word.toUpperCase()}`;
  }
}
