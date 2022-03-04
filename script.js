// GLOBAL VARIABLES ===================================================
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};
let player = { speed: 5, score: 0 };
let pShip;

// GETTING DOM ELEMENTS ========================================================
let page = document.querySelector('.page')
let startBtn = document.querySelector('.startBtn')
let track = document.querySelector('.track')
let scoreDiv = document.querySelector('.scoreDiv')
let instructions = document.querySelector('.instructions')

// CREATING SMALL STARS ===================================================== 
let Bnos = 20
let Mnos = 40
let Snos = 80
function rX() {
    return (Math.floor(Math.random() * screen.width))
}
function rY() {
    return (Math.floor(Math.random() * screen.height))
}
for (let i = 0; i < Bnos; i++) {
    let bStar = document.createElement('div');
    bStar.setAttribute('class', 'bStar');
    bStar.y = rY();
    bStar.x = rX()
    bStar.style.top = `${bStar.y}px`;
    bStar.style.left = `${bStar.x}px`
    page.append(bStar);
}
for (let i = 0; i < Mnos; i++) {
    let mStar = document.createElement('div');
    mStar.setAttribute('class', 'mStar');
    mStar.y = rY();
    mStar.x = rX()
    mStar.style.top = `${mStar.y}px`;
    mStar.style.left = `${mStar.x}px`
    page.append(mStar);
}
for (let i = 0; i < Snos; i++) {
    let sStar = document.createElement('div');
    sStar.setAttribute('class', 'sStar');
    sStar.y = rY();
    sStar.x = rX()
    sStar.style.top = `${sStar.y}px`;
    sStar.style.left = `${sStar.x}px`
    page.append(sStar);
}

// READING THE CONTROL INPUT ================================================== 
const keyDown = (event) => {
    // THIS WILL ENABLE THE KEY 
    keys[event.key] = true;
    // console.log(keys);
};
const keyUp = (event) => {
    // THIS WILL DISABLE THE KEY 
    keys[event.key] = false;
    // console.log(keys);
};
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// STARTING THE GAME =========================================================== 
const startGame = () => {
    // THIS WILL HIDE THE START BUTTON AND PREPARE THE TRACK     
    startBtn.classList.add('hidden');
    instructions.classList.add('hidden')
    document.querySelector('.shipImg').classList.add('hidden')
    document.querySelector('.heading').classList.add('hidden')
    scoreDiv.classList.remove('hidden')
    player.score = 0

    track.innerHTML = ''

    player.play = true;

    // THIS WILL GIVE VARIOUS DIMENTIONS OF TRACK AND STORE IT IN AN ARRAY
    trDim = track.getBoundingClientRect();
    // console.log(trDim);

    // CREATING PLAYERS SHIP AND ADDING IN TRACK 
    pShip = document.createElement('div');
    pShip.setAttribute('class', 'pShip');
    pShip.innerHTML = `<img src="./assets/pShip.png">`
    track.append(pShip);

    // CREATING BOUNDRIES AND ADDING IN TRACK
    for (let i = 0; i < 6; i++) {
        let boundry = document.createElement('div');
        boundry.setAttribute('class', 'boundry');
        boundry.y = 150 * i;
        boundry.style.top = `${boundry.y}px`;
        track.append(boundry);
    }

    // CREATING RANDOM SHIPS AND ADDING IN TRACK
    for (let i = 0; i < 3; i++) {
        let rShip = document.createElement('div');
        rShip.setAttribute('class', 'rShip');
        rShip.y = ((i + 1) * 300) * -1;
        rShip.style.top = `${rShip.y}px`;
        rShip.innerHTML = `<img src="./assets/rocket${i + 1}.png">`
        rShip.style.left = `${Math.ceil(Math.random() * (trDim.width - 70))}px`;
        track.append(rShip);
    }

    //INITIAL POSITIONING PLAYERS SHIP 
    // offsetTop , offsetLeft gives position reletive to top and left of screen 
    player.x = pShip.offsetLeft;
    player.y = pShip.offsetTop;

    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    window.requestAnimationFrame(playGame);
};

// PLAY GAME ========================================================================================= 
const playGame = () => {
    if (player.play === true) {
        // calling moveBoundries and moverShips function to move the boundries  and random ships
        moveBoundries();
        moverShips();
        moveBStar();
        moveMStar();
        moveSStar();

        // CHANGING POSITIONS OF SHIP 
        if (keys.ArrowUp === true && player.y > (trDim.top + 150)) { player.y -= player.speed };
        if (keys.ArrowDown === true && player.y < (trDim.bottom - 150)) { player.y += player.speed };
        if (keys.ArrowLeft === true && player.x > 5) { player.x -= player.speed };
        if (keys.ArrowRight === true && player.x < (trDim.width - 100)) { player.x += player.speed };

        pShip.style.top = `${player.y}px`;
        pShip.style.left = `${player.x}px`;

        // DISPLAY SCORE 
        player.score = player.score + 1
        scoreDiv.innerText = `Score : ${player.score}`

        // THIS WILL INVOKE PLAYGAME AGAIN 
        window.requestAnimationFrame(playGame);
    };

};

// START BUTTON ============================================================
startBtn.addEventListener('click', startGame);

// THIS WILL MOVE THE BOUNDRIES ========================================================================
const moveBoundries = () => {
    let boundries = document.querySelectorAll('.boundry');
    boundries.forEach((val) => {
        if (val.y > 700) {
            val.y -= 750;
        };
        val.y += player.speed;
        val.style.top = `${val.y}px`;
    });
};

// THIS WILL MOVE THE RANDOM SHIPS ========================================================================
const moverShips = () => {
    let rShips = document.querySelectorAll('.rShip');
    rShips.forEach((val) => {
        // calling check collision function for each random ship 
        if (checkCollision(val)) {
            // THIS WILL STOP THE GAME 
            pShip.style.border = '2px solid red'
            val.style.border = '2px solid red'
            stopGame()
        }

        if (val.y > 750) {
            val.y -= 900;
            val.style.left = `${Math.ceil(Math.random() * (trDim.width - 100))}px`;
        };
        val.y += player.speed * .8;
        val.style.top = `${val.y}px`;
    });
};

// THIS WILL MOVE THE STARS ========================================================================
const moveBStar = () => {
    let bStars = document.querySelectorAll('.bStar');
    bStars.forEach((val) => {
        if (val.y > 700) {
            val.y -= 750;
            val.style.left = `${rX()}px`
        };
        val.y += player.speed * .3;
        val.style.top = `${val.y}px`;
    });
};
const moveMStar = () => {
    let mStars = document.querySelectorAll('.mStar');
    mStars.forEach((val) => {
        if (val.y > 700) {
            val.y -= 750;
            val.style.left = `${rX()}px`
        };
        val.y += player.speed * .2;
        val.style.top = `${val.y}px`;
    });
};
const moveSStar = () => {
    let sStars = document.querySelectorAll('.sStar');
    sStars.forEach((val) => {
        if (val.y > 700) {
            val.y -= 750;
            val.style.left = `${rX()}px`
        };
        val.y += player.speed * .1;
        val.style.top = `${val.y}px`;
    });
};

// CHECKING COLLISION ================================================================================
const checkCollision = (rShip) => {
    pShipSpan = pShip.getBoundingClientRect()
    rShipSpan = rShip.getBoundingClientRect()
    return !(pShipSpan.top > rShipSpan.bottom || pShipSpan.bottom < rShipSpan.top || pShipSpan.left > rShipSpan.right || pShipSpan.right < rShipSpan.left)
}

// STOP GAME ======================================================================== 
const stopGame = () => {
    player.play = false
    scoreDiv.classList.add('hidden')
    instructions.innerHTML = `Score : ${player.score}`
    instructions.classList.remove('hidden')
    startBtn.innerText = 'Re-start'
    startBtn.classList.remove('hidden')
}