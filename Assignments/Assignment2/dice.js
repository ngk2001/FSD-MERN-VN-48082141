const finalResult = document.getElementById("result");
const p1DiceImage = document.getElementById("dice1");
const p2DiceImage = document.getElementById("dice2");

const diceRoll = document.getElementById("roll-btn");

diceRoll.addEventListener("click", function () {
  let p1 = Math.floor(Math.random() * 6)+ 1;
  console.log(p1);
  let p2 = Math.floor(Math.random() * 6)+ 1;
  console.log(p2);

  p1DiceImage.src = `./images/dice${p1}.png`;
  p2DiceImage.src = `./images/dice${p2}.png`;

  if (p1 > p2) {
    finalResult.innerText = "Player One is Win🏆";
    // alert("PLAYER ONE IS WIN THIS ONE!!");
  } else if (p1 < p2) {
    finalResult.innerText = "Player Two is Win🏆";
    // alert("PLAYER TWO WIN THIS TIME!!");
  } else {
    finalResult.innerText = "Match is Draw🏁";
    alert("This Match is Draw");
  }
});
