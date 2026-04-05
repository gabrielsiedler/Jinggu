import { useState, useCallback } from 'react'
import * as s from './picker.s'

interface ImageThumbnailProps {
  filename: string
  selected: boolean
  onClick: (filename: string) => void
}

const ImageThumbnail = ({ filename, selected, onClick }: ImageThumbnailProps) => {
  const [broken, setBroken] = useState(false)

  const handleError = useCallback(() => {
    setBroken(true)
  }, [])

  const handleClick = useCallback(() => {
    onClick(filename)
  }, [onClick, filename])

  return (
    <s.Cell $selected={selected} onClick={handleClick} title={filename}>
      {broken ? (
        <s.ThumbnailPlaceholder>?</s.ThumbnailPlaceholder>
      ) : (
        <s.Thumbnail src={`/sprites/${filename}.png`} alt={filename} onError={handleError} draggable={false} />
      )}
      <s.Filename>{filename}</s.Filename>
    </s.Cell>
  )
}

export default ImageThumbnail
