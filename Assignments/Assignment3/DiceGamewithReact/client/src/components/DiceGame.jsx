import React, { useState } from 'react'
import dice1 from '../assets/dice1.png';
import dice2 from '../assets/dice2.png';
import dice3 from '../assets/dice3.png';
import dice4 from '../assets/dice4.png';
import dice5 from '../assets/dice5.png';
import dice6 from '../assets/dice6.png';


function DiceGame() {
    const dices = [dice1, dice2, dice3, dice4, dice5, dice6]
    const [p1, setP1Dice] = useState(0)
    const [p2, setP2Dice] = useState(0)
    const [p1Dice, setP1DicePic] = useState(dice1)
    const [p2Dice, setP2DicePic] = useState(dice1)


    const [result, setResult] = useState("Let's Play")

    function rollDice() {
        setP1Dice(Math.floor(Math.random() * 6))
        setP2Dice(Math.floor(Math.random() * 6))
        setP1DicePic(dices[p1])
        setP2DicePic(dices[p2])
        if (p1 > p2) {
            setResult("Player 1 Wins")

        } else if (p2 > p1) {
            setResult("Player 2 wins")
        }
        else {
            setResult("Match is draw")
        }

    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh", backgroundColor: "black" }}>
            <h2 style={{ color: "white", marginBottom: "30px" }}>  {result}
            </h2>
            <div id="players" className="d-flex" style={{ gap: "15px" }}>
                <div>
                    <p style={{ color: "white" }} >Player 1</p>
                    <img id="p1image" src={p1Dice} width="150" hight="150" />
                </div>
                <div>
                    <p style={{ color: "white" }}>Player 2</p>
                    <img id="p2image" src={p2Dice} width="150" hight="150" />
                </div>
            </div>
            <button onClick={rollDice} className="btn btn-primary mt-3">Roll Dice</button>

        </div>
    )
}

export default DiceGame
