import { useCallback, useState } from 'react'
import * as s from './gridcomposer.s'

interface GridCellProps {
  row: number
  col: number
  cellIndex: number
  image: string | null
  onAssign: (row: number, col: number) => void
}

const GridCell = ({ row, col, cellIndex, image, onAssign }: GridCellProps) => {
  const [imgError, setImgError] = useState(false)

  const handleClick = useCallback(() => {
    onAssign(row, col)
  }, [row, col, onAssign])

  return (
    <s.Cell $assigned={image !== null} onClick={handleClick} title={image ?? `Cell ${cellIndex + 1} (empty)`}>
      {image && !imgError ? (
        <s.CellImage src={`/sprites/${image}.png`} alt={image} onError={() => setImgError(true)} />
      ) : (
        <s.CellPlaceholder>+</s.CellPlaceholder>
      )}
      <s.CellIndex>{cellIndex + 1}</s.CellIndex>
    </s.Cell>
  )
}

export default GridCell
