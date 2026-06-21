import { useState } from "react"
import { AppHeading } from "../shared/ui/components/AppHeading";
import { AppText } from "../shared/ui/components/AppText";

export const App = () => {
  const [user, setUser] = useState<'red' | 'blue'>('red')
  const [isWin, setIsWin] = useState<boolean>(false)

  const defaultBoard = [
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
    [null, null, null, null, null, null],
  ]
  const [board, setBoard] = useState<Array<Array<'blue' | 'red' | null>>>(defaultBoard)

  const MAX_COL_INDEX = 6
  const MAX_ROW_INDEX = 5

  const MIN_ROW_WIN_INDEX = 2


  const handleToggleUser = () => {
    setUser(user === 'blue' ? 'red' : 'blue')
  }

  const handleMove = (colIndex: number) => {

    if (isWin) {
      handleReset()
      return
    }

    if (board[colIndex].at(0)) {
      console.log('В эту колонну походить нельзя')
      return
    }

    let lastEmptyCellIndex = -1
    for (const cell of board[colIndex]) {
      if (cell) break
      lastEmptyCellIndex += 1
    }

    const newBoard = [...board]
    newBoard[colIndex][lastEmptyCellIndex] = user

    setBoard(newBoard)

    const hasWon = checkWin(colIndex, lastEmptyCellIndex)
    if (!hasWon) handleToggleUser()
  }

  const handleReset = () => {
    setBoard(defaultBoard)
    setIsWin(false)
  }

  const checkWin = (colIndex: number, cellIndex: number) => {
    if (checkVerticalWin(colIndex, cellIndex)) return true
    if (checkHorizontalWin(colIndex, cellIndex)) return true
    if (checkDiagonalWin(colIndex, cellIndex)) return true
    return false
  }

  const checkVerticalWin = (colIndex: number, cellIndex: number) => {
    if (cellIndex === MAX_ROW_INDEX || cellIndex > MIN_ROW_WIN_INDEX) return false

    let streak = 1
    let tmpIndex = cellIndex + 1
    while (tmpIndex <= MAX_ROW_INDEX) {
      if (streak === 4) break

      const tmpCell = board[colIndex][tmpIndex]

      if (tmpCell !== user) break

      streak += 1
      tmpIndex += 1
    }

    if (streak === 4) {
      setIsWin(true)
      return true
    }

    return false
  }

  const checkHorizontalWin = (colIndex: number, cellIndex: number) => {
    const row: Array<'blue' | 'red' | null> = []
    board.forEach((col) => row.push(col[cellIndex]))

    console.log('row', row)

    let streak = 1
    let tmpRgIndex = colIndex + 1
    let tmpLfIndex = colIndex - 1
    while (tmpRgIndex <= MAX_COL_INDEX) {
      if (streak === 4) break

      const tmpCell = row[tmpRgIndex]

      console.log('row Rg')

      if (tmpCell !== user) break

      console.log('rg', tmpCell, tmpRgIndex)

      streak += 1
      tmpRgIndex += 1
    }
    while (tmpLfIndex >= 0) {
      if (streak === 4) break

      const tmpCell = row[tmpLfIndex]

      console.log('row lf')

      if (tmpCell !== user) break

      console.log('rg', tmpCell, tmpLfIndex)

      streak += 1
      tmpLfIndex -= 1
    }

    console.log('streak', streak)

    if (streak === 4) {
      setIsWin(true)
      return true
    }

    return false
  }

  const checkDiagonalWin = (
    colIndex: number, 
    cellIndex: number
  ) => {
    const diagonalRg: Array<'blue' | 'red' | null> = []
    const diagonalLf: Array<'blue' | 'red' | null> = []

    let middle = false
    board.forEach((col, i) => {
      if (i === colIndex) {
        diagonalRg.push(col[cellIndex])
        diagonalLf.push(col[cellIndex])
        middle = true
        return
      }

      if (!middle) {
        const tmpCol = colIndex - i
        const tmpCellRg = cellIndex - tmpCol
        const tmpCellLf = cellIndex + tmpCol
        if (tmpCellRg >= 0) {
          diagonalRg.push(col[tmpCellRg])
        } else {
          diagonalRg.push(null)
        }
        if (tmpCellLf <= MAX_ROW_INDEX) {
          diagonalLf.push(col[tmpCellLf])
        } else {
          diagonalLf.push(null)
        }
      } else {
        const tmpCol = i - colIndex
        const tmpCellRg = cellIndex + tmpCol
        const tmpCellLf = cellIndex - tmpCol
        if (tmpCellRg <= MAX_ROW_INDEX) {
          diagonalRg.push(col[tmpCellRg])
        } else {
          diagonalRg.push(null)
        }
        if (tmpCellLf >= 0) {
          diagonalLf.push(col[tmpCellLf])
        } else {
          diagonalLf.push(null)
        }
      }
    })

    console.log('diagonalRg', diagonalRg)
    console.log('diagonalLf', diagonalLf)

    console.log('cellIndex', cellIndex)
    console.log('colIndex', colIndex)

    let streakRg = 1
    let tmpRgRgIndex = colIndex + 1
    let tmpRgLfIndex = colIndex - 1
    while (tmpRgRgIndex <= MAX_COL_INDEX) {
      if (streakRg === 4) break

      const tmpCell = diagonalRg[tmpRgRgIndex]

      console.log('diagonalRg Rg')

      if (tmpCell !== user) break

      console.log('rg', tmpCell, tmpRgRgIndex)

      streakRg += 1
      tmpRgRgIndex += 1
    }
    while (tmpRgLfIndex >= 0) {
      if (streakRg === 4) break

      const tmpCell = diagonalRg[tmpRgLfIndex]

      console.log('diagonalRg Lf')

      if (tmpCell !== user) break

      console.log('lf', tmpCell, tmpRgLfIndex)

      streakRg += 1
      tmpRgLfIndex -= 1
    }

    console.log('------------')

    let streakLf = 1
    let tmpLfRgIndex = colIndex + 1
    let tmpLfLfIndex = colIndex - 1
    while (tmpLfRgIndex <= MAX_COL_INDEX) {
      if (streakLf === 4 || streakRg === 4) break

      const tmpCell = diagonalLf[tmpLfRgIndex]

      console.log('diagonalLf Rg')

      if (tmpCell !== user) break

      console.log('rg', tmpCell, tmpLfRgIndex)

      streakLf += 1
      tmpLfRgIndex += 1
    }
    while (tmpLfLfIndex >= 0) {
      if (streakLf === 4 || streakRg === 4) break

      const tmpCell = diagonalLf[tmpLfLfIndex]

      console.log('diagonalLf Lf')

      if (tmpCell !== user) break

      console.log('lf', tmpCell, tmpLfLfIndex)

      streakLf += 1
      tmpLfLfIndex -= 1
    }

    console.log('------------')

    console.log('streakRg', streakRg)
    console.log('streakLf', streakLf)

    if (streakRg === 4 || streakLf === 4) {
      setIsWin(true)
      return true
    }

    return false
  }

  return (
    <div className="root">
      <AppText text={`User: ${user}`} />
      {isWin && <AppHeading text={`${user.toUpperCase()} WIN`} size="L" />}
      <div className="boardWrapper">
        {board.map((col, colIndex) => (
          <div className="col" key={colIndex} onClick={() => handleMove(colIndex)}>
            {col.map((cell, rowIndex) => (
              <div 
                key={rowIndex}
                className={`${cell ? `cell ${cell === 'blue' ? 'blue' : 'red'}` : 'empty'}`}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleReset}>Reset</button>
    </div>
  )
}

export default App