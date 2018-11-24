// a list that holds all of cards
const cardsArray = ['fa-anchor', 'fa-anchor', 'fa-bicycle', 'fa-bolt', 'fa-cube', 'fa-diamond', 'fa-diamond', 'fa-plane', 'fa-leaf', 'fa-bomb', 'fa-leaf', 'fa-bomb', 'fa-bolt', 'fa-bicycle', 'fa-plane', 'fa-cube'];

let startGame = 0;
let memory_values = [];
let tilesFlipped = 0;
let card;
let card1;
let minutes = 0;
let seconds = 0;
let gameInterval;
const time_minutes = document.getElementsByClassName('displayMinutes')[0];
const time_seconds = document.getElementsByClassName('displaySeconds')[0];
let movesCount = 0;
let starCount = 3;

const moves = document.getElementsByClassName('moves');
const restart_game = document.getElementsByClassName('restart');

//add listener to restart button
restart_game[0].addEventListener('click', function () {
	restart();
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function moves_counter(){
	movesCount +=1;
	moves[0].innerHTML = movesCount;
}

function restart(){
	clearInterval(gameInterval);
	startGame = 0;
	movesCount = 0;
	starCount = 3;
	tilesFlipped = 0;
	memory_values = [];
	time_minutes.innerHTML = '00';
	time_seconds.innerHTML = '00';
	seconds = 0;
    minutes = 0;
	moves[0].innerHTML = '0';
	showStars();
	gameStart();
}

function hideStars(){
	const modal_star = document.getElementsByClassName('star-result');
	for (let i = 0; i < modal_star.length; i++) {
		modal_star[i].classList.remove('fa-star');
		modal_star[i].classList.remove('fa-star-o');
	}
}

function showStars(){
//show stars again
	const star = document.getElementsByClassName('star');
	if(star.length>0){
		for (let i = 0; i < star.length; i++) {
			star[i].classList.add('fa-star');
			star[i].classList.remove('fa-star-o');
		}
	}
}

function rating(movesCount) {
	const star = document.getElementsByClassName('star');

    if (movesCount === 20) {
	    star[0].classList.add('fa-star-o');
		star[0].classList.remove('fa-star');
		starCount --;
	} else if (movesCount === 24) {
		star[1].classList.add('fa-star-o');
        star[1].classList.remove('fa-star');
		starCount --;
    } else if (movesCount === 28) {
		star[2].classList.add('fa-star-o');
        star[2].classList.remove('fa-star');
		starCount --;
    }
}

function timer() {
    gameInterval = setInterval(function () {
        seconds = parseInt(seconds, 10) + 1;
        minutes = parseInt(minutes, 10);
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
		time_minutes.innerHTML = minutes;
		time_seconds.innerHTML = seconds;
    }, 1000);
}

function endOfGame() {
	result();
	restart();
}

function displayCard(card){
    card.classList.add('open');
    card.classList.add('show');
}

function hideCard(card,card1){
	card1.classList.add('unMatch');
	card.classList.add('unMatch');
	
	function flip2Back(){
		memory_values = [];
		card.classList.remove('show');
		card.classList.remove('open');
		card1.classList.remove('show');
		card1.classList.remove('open');
		card.classList.remove('unMatch');
		card1.classList.remove('unMatch');
	}
	setTimeout(flip2Back, 500);
}

function testMatch(card){
	const icon = card.getElementsByClassName('fa');
	const val = icon[0].classList[1];

	if(memory_values.length == 0){
		//the first card
		memory_values.push(val);
		card1 = card;
	}else if(memory_values.length == 1){
		moves_counter();
		rating(movesCount);
		//the second card
		memory_values.push(val);

		if(memory_values[0] == memory_values[1]){
			//test if the two cards match
			memory_values = [];
			tilesFlipped += 2;

			//when all cards are flipped, end game
			if(tilesFlipped == cardsArray.length){
				setTimeout(endOfGame, 500);
			}

		} else {
			// when not match, hide cards
			hideCard(card,card1);
		}
	}
}

const pick_card = (card) => {
    card.addEventListener('click', function (e) {
		if (startGame === 0) {
            startGame++;
			timer();
        }

		//test if this card is already open
		if (card.classList.contains('open')) {
            return true;
        }

		// to prevent flipping until cards test
		if (memory_values.length === 2){
			return true;
		}
		
		displayCard(card);
		testMatch(card);
	})
};

const newCard = (cardClass) => {
    // we create a new li element with a class 'card'
    const li = document.createElement('li');
    li.classList.add('card');
    // we create a 'i' element called icon and we applied to it a 'fa' class, then we applied a class form the array of cards
    const icon = document.createElement('i');
    li.appendChild(icon);
    icon.classList.add('fa');
    icon.classList.add(cardClass);
	return li;
};

function gameStart() {
	const list = document.getElementsByClassName('deck');
    // we empty the current board of cards
    list[0].innerHTML = '';

    // We first shuffle the array of cards
    const cardsShuffled = shuffle(cardsArray);

    for (const card of cardsShuffled) {
        const li = newCard(card);
        list[0].appendChild(li);
    }

    const cards = list[0].getElementsByClassName('card'); // it's an html collection
    for (const card of cards) {
		pick_card(card);
	}
}

// When all cards have matched, open the modal 
function result(){
	const modal = document.getElementsByClassName('modal')[0];
	const play_again = document.getElementsByClassName('play-again')[0];

	// open the modal
	modal.style.display = 'block';

	// When the user clicks on Play Again button, close the modal and restart the game
	play_again.onclick = function() {
		endOfGame();
		modal.style.display = 'none';
		hideStars();
	}

	// When the user clicks anywhere outside of the modal, close it and restart the game
	window.onclick = function(event) {
		if (event.target == modal) {
			endOfGame();
			modal.style.display = 'none';
			hideStars();
		}
	}

	score();
}

//display the game result (moves, stars and time)
function score() {
		const moves_result = document.getElementsByClassName('moves-result');
		moves_result[0].innerHTML = movesCount;
		const time_result = document.getElementsByClassName('time-result');
		time_result[0].innerHTML = (parseInt(minutes) >0 ? (minutes +' minutes and ' ) : '') +seconds+' Seconds';
		const star_result = document.getElementsByClassName('star-result');

		if (starCount === 3) {
			star_result[0].classList.add('fa','fa-star');
			star_result[1].classList.add('fa','fa-star');
			star_result[2].classList.add('fa','fa-star');
		} else if (starCount === 2) {
			star_result[0].classList.add('fa','fa-star');
			star_result[1].classList.add('fa','fa-star');
			star_result[2].classList.add('fa','fa-star-o');
		} else if (starCount === 1) {
			star_result[0].classList.add('fa','fa-star');
			star_result[1].classList.add('fa','fa-star-o');
			star_result[2].classList.add('fa','fa-star-o');
		}
	}
	
gameStart();
