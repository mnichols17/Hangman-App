let correct = 0;
let wrongCount = 0;

document.getElementById('newGame_button').onclick = function(){
  document.getElementById("newGame").setAttribute('hidden',true);
  $('.btn-light').prop('disabled',false);
  var buttons = document.getElementsByClassName('btn-light');
  for(button of buttons){button.style.background = "white";}
  correct = 0;
  wrongCount = 0;
  getWord();
};

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
      if(correct == wordArray.length){endGame(true);}
      else if(wrongCount >= 7) {endGame(false);}
    }
  }
}

function checkWord(word){
  if(word.length > 12){return false;}
  let badChars = [" ","-",",",".","/"];
  for(let char of badChars){
    if(word.indexOf(char) > -1){return false;}
  }
  return true;
}

function checkGuess(guess, wordArray, guessArray){
  for(let i in wordArray){
    if(wordArray[i] == guess){
      guessArray[i] = guess;
      correct++;
    }
  }
  setGuess(guessArray);
}

function setGuess(guessArray){
  let output = "";
  for(let char of guessArray){ output += char + " ";}
  document.getElementById('panel_2').innerHTML = `<h2>${output}</h2>`;
}

function endGame(result){
  $('.btn-light').prop('disabled',true);
  document.getElementById("newGame").removeAttribute('hidden');
  if(result){
    document.getElementById('panel_1').innerHTML = `<h1>You won!</h1>`;
  } else {
    document.getElementById('panel_1').innerHTML = `<h1>You lost!</h1>`;
  }
}
