import './style.css'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30


canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)
const board = Array.from({length: BOARD_HEIGHT}, () => Array(BOARD_WIDTH).fill(0))

//  piece player 
const piece = {
  position : {x: 5, y: 5},
  matrix: [
    [1, 1],
    [1, 1]
  ] 
}

const randomPiece = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [1, 1, 1],
    [0, 1, 0]
  ],
  [
    [1, 1, 1],
    [1, 0, 0]
  ],
  [
    [1, 1, 1],
    [0, 0, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 0, 0],
    [1, 1, 1]
  ]
]



// game loop
let lastTime = 0
let dropCounter = 0
function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time
  dropCounter += deltaTime
  if (dropCounter > 1000) {
    piece.position.y++
    if (collide(board, piece)){
      piece.position.y--
      merge(board, piece)
      removeRow()
    }
    dropCounter = 0
  }
  draw()
  window.requestAnimationFrame(update)
}

function draw() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        context.fillStyle = 'red'
        context.fillRect(x, y, 1, 1)
      }
    })
   }
  )

  piece.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'blue'
        context.fillRect(piece.position.x + x, piece.position.y + y, 1, 1)
      }
    })
  })
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') {
    piece.position.y++
    if (collide(board, piece)){
      piece.position.y--
      merge(board, piece)
      removeRow()
    }
  }
  if (event.key === 'ArrowRight') {
    piece.position.x++
    if (collide(board, piece)){
      piece.position.x--
    }
  }
  if (event.key === 'ArrowLeft') {
    piece.position.x--
    if (collide(board, piece)){
      piece.position.x++
      
    }
  }

  if (event.key === 'ArrowUp') {
    const rotate = []
    for (let i = 0; i < piece.matrix[0].length; i++) {
      const row = []
      for (let j = piece.matrix.length - 1; j >= 0; j--) {
        row.push(piece.matrix[j][i])
      }
      rotate.push(row)
    }
    piece.matrix = rotate
  
  }

  
})

function collide(board, piece) {
  const [m, o] = [piece.matrix, piece.position]

  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] && (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
        return true
      }
    }
  }
  return false
}


function merge(board, piece) {
  piece.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value ) {
        board[y + piece.position.y][x + piece.position.x] = value
      }
    })
  })

  piece.matrix = randomPiece[Math.floor(Math.random() * randomPiece.length)]
  piece.position.y = 0
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 1)  

  if (collide(board, piece)) {
    alert('Game Over')
    board.forEach(row => row.fill(0))
     
  }

}


function removeRow() {
  const rowsToRemove = []
  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
  })
}



update()


// 3 board 
