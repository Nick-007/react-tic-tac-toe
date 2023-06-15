import { useState } from 'react';
function Square({win, i, value, onsquareClick}) {
  let cls = ''
  if(win){
   cls = win.includes(i)?"square won":"square"
  }else{
    cls = "square"
  }
  return <button className={cls} onClick={onsquareClick}>{value}</button>
}

function Board({ xIsNext, win, draw, gameover, squares, onPlay }) {
  let wintxt = win? "Winner is: ":"Next Player is: "
  let nextp = xIsNext?"X":"O";
  wintxt += win?squares[win[0]]:nextp;
  let status = gameover && draw?"Game is a Draw":wintxt
  function handleClick(index) {
    if(squares[index] || win){return}
    const newplay = squares.slice();
    let r,c
    r = Math.floor(index/3)+1
    c = index>2?(index+1)-((r-1)*3):index+1
    newplay[index] = nextp;
    onPlay(newplay,r,c)
  }
  function rendersquare(i,win=null){
    return <Square key={i} i={i} win={win} value={squares[i]} onsquareClick={() => handleClick(i)} />
  }
  function renderrow(key,sqtxt){
    return <div key={key} className="board-row">{sqtxt}</div>
  }
 
 const renderboard = function(){
    let i, row=0, cell, root=Math.sqrt(squares.length), sqs, rows=[]
    for(i=0; i<squares.length; i++){
      sqs = []
      for(cell=0; cell<root; cell++){
        let v = (row*root)+cell
        sqs.push(rendersquare(v,win))
      }
      if(i % 3 === 0){row++; cell=0; rows.push(renderrow(row, sqs))}
    } 
    return rows;
}

  
  return (
    <>
      <div className="status">{status}</div>
      {renderboard()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]
  const [isrev, setisRev] = useState(false)
  const [sortxt, setSortxt] = useState('Descending')
  const [status, setStatus] = useState(null)
  const [draw, setDraw] = useState(null)
  const [gameover, setGameOver] = useState(false)
  const [rowcol, setRowCol] = useState([Array(0)])
  function handlePlay(newplay,r,c){
    let winner = calculateWinner(currentSquares);
    if(winner){setStatus(winner); setGameOver(true); return}
    rowcol.push([[currentMove][0]=r,[currentMove][1]=c])
    const nextHistory = [...history.slice(0,currentMove + 1), newplay]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
    if(currentMove+1>8 && !status){
      setDraw(true); setGameOver(true)
    }
  }
  function jumpTo(nextMove){
    setCurrentMove(nextMove)
  }
  function sortMoves(){
    setisRev(!isrev)
    if(isrev){setSortxt('Ascending')}else{setSortxt('Descending')}
    moves()
  }

  function moves(){
    const list = history.map((squares,move) => {
    let desc = move ===currentMove?"You are at Move# ":move?"Go to move# ":"Start "
    desc += move?move +" (Row:"+rowcol[move][0]+" ,Col:"+rowcol[move][1]+")":move
    let disp = move===currentMove?desc:<button onClick={() => jumpTo(move)}>{desc}</button>
    return (
      <li key={move}>
        {disp}
      </li>
    )
    })
    return isrev?list.reverse():list
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} win={status} draw={draw} gameover={gameover} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol><button onClick={()=>sortMoves()}>Sort Moves {sortxt}</button>{moves()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c];
    }
  }
  return null;
}
