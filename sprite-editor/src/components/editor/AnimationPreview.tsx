import { useCallback, useEffect, useRef, useState } from 'react'
import type { DirectionalFrames, EntityDefinition } from '@jinggu/shared'
import * as s from './animationpreview.s'

type Direction = keyof DirectionalFrames

const DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right']
const ANIM_TYPES = ['idle', 'walk'] as const
type AnimType = (typeof ANIM_TYPES)[number]

interface AnimationPreviewProps {
  definition: EntityDefinition
}

const AnimationPreview = ({ definition }: AnimationPreviewProps) => {
  const { animations } = definition.render

  const [direction, setDirection] = useState<Direction>('down')
  const [animType, setAnimType] = useState<AnimType>('idle')
  const [frameIndex, setFrameIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const animFrames: DirectionalFrames | undefined = animations?.[animType]
  const frames: string[] = animFrames ? animFrames[direction] ?? [] : []

  // Reset frame index when direction, animType, or definition changes
  useEffect(() => {
    setFrameIndex(0)
  }, [direction, animType, definition])

  // Frame cycling at 250ms
  useEffect(() => {
    if (frames.length <= 1) return

    intervalRef.current = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length)
    }, 250)

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [frames.length])

  const currentFrame = frames[frameIndex] ?? null

  const handleDirectionClick = useCallback((dir: Direction) => {
    setDirection(dir)
  }, [])

  const handleAnimTypeClick = useCallback((type: AnimType) => {
    setAnimType(type)
  }, [])

  if (!animations) return null

  return (
    <s.Container>
      <s.Title>Animation Preview</s.Title>

      <s.FrameDisplay>
        {currentFrame ? (
          <s.FrameImage src={`/sprites/${currentFrame}.png`} alt={currentFrame} />
        ) : (
          <s.FramePlaceholder>No frames</s.FramePlaceholder>
        )}
      </s.FrameDisplay>

      {currentFrame && (
        <s.FrameLabel>
          {currentFrame} ({frameIndex + 1}/{frames.length})
        </s.FrameLabel>
      )}

      <s.ButtonRow>
        {DIRECTIONS.map((dir) => (
          <s.DirectionButton key={dir} $active={direction === dir} onClick={() => handleDirectionClick(dir)}>
            {dir}
          </s.DirectionButton>
        ))}
      </s.ButtonRow>

      <s.ButtonRow>
        {ANIM_TYPES.map((type) => (
          <s.AnimTypeButton key={type} $active={animType === type} onClick={() => handleAnimTypeClick(type)}>
            {type}
          </s.AnimTypeButton>
        ))}
      </s.ButtonRow>
    </s.Container>
  )
}

export default AnimationPreview
