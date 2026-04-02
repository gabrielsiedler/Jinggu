import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Grid, type CellComponentProps } from 'react-window'
import { unassignedImagesAtom } from '../../atoms/images'
import { registryAtom, dirtyAtom } from '../../atoms/registry'
import { selectedCategoryAtom, selectedSpriteKeyAtom } from '../../atoms/selection'
import { imagePickerOpenAtom, imagePickerTargetAtom, type ImagePickerTarget } from '../../atoms/ui'
import ImageThumbnail from './ImageThumbnail'
import * as s from './picker.s'

const CELL_WIDTH = 52
const CELL_HEIGHT = 56

/** Derive a human-readable title from the picker target */
const getTitle = (target: ImagePickerTarget): string => {
  if (!target) return 'Select image'
  switch (target.type) {
    case 'base':
      return 'Select base image'
    case 'variant':
      return `Select variant image (#${target.index + 1})`
    case 'gridCell':
      return `Select image for cell (${target.row}, ${target.col})`
    default:
      return 'Select image'
  }
}

interface CellData {
  images: string[]
  columnCount: number
  selectedImage: string | null
  onSelect: (filename: string) => void
}

const CellRenderer = ({
  columnIndex,
  rowIndex,
  style,
  images,
  columnCount,
  selectedImage,
  onSelect,
}: CellComponentProps<CellData>) => {
  const index = rowIndex * columnCount + columnIndex
  if (index >= images.length) {
    return <div style={style} />
  }

  const filename = images[index]
  return (
    <div style={style}>
      <ImageThumbnail filename={filename} selected={selectedImage === filename} onClick={onSelect} />
    </div>
  )
}

const ImagePicker = () => {
  const [isOpen, setIsOpen] = useAtom(imagePickerOpenAtom)
  const target = useAtomValue(imagePickerTargetAtom)
  const setTarget = useSetAtom(imagePickerTargetAtom)
  const unassignedImages = useAtomValue(unassignedImagesAtom)
  const setRegistry = useSetAtom(registryAtom)
  const setDirty = useSetAtom(dirtyAtom)
  const category = useAtomValue(selectedCategoryAtom)
  const spriteKey = useAtomValue(selectedSpriteKeyAtom)

  const [search, setSearch] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 600, height: 400 })

  const filteredImages = useMemo(() => {
    if (!search.trim()) return unassignedImages
    const query = search.toLowerCase()
    return unassignedImages.filter((f) => f.toLowerCase().includes(query))
  }, [unassignedImages, search])

  const columnCount = Math.max(1, Math.floor(containerSize.width / CELL_WIDTH))
  const rowCount = Math.ceil(filteredImages.length / columnCount)

  // Measure container size
  useEffect(() => {
    if (!isOpen) return
    const measure = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current
        if (clientWidth > 0 && clientHeight > 0) {
          setContainerSize({ width: clientWidth, height: clientHeight })
        }
      }
    }
    // Use requestAnimationFrame to measure after DOM layout
    const raf = requestAnimationFrame(measure)
    const observer = new ResizeObserver(measure)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Reset state when picker opens
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedImage(null)
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setTarget(null)
  }, [setIsOpen, setTarget])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose()
      }
    },
    [handleClose],
  )

  const handleSelect = useCallback((filename: string) => {
    setSelectedImage((prev) => (prev === filename ? null : filename))
  }, [])

  const handleConfirm = useCallback(() => {
    if (!selectedImage || !target || !category || !spriteKey) return

    setRegistry((prev) => {
      const next = structuredClone(prev)

      const getDef = () => {
        if (category === 'entities') return next.entities[spriteKey]
        return next.tiles[category][spriteKey]
      }

      const def = getDef()
      if (!def) return prev

      switch (target.type) {
        case 'base':
          def.render.base = selectedImage
          break
        case 'variant': {
          const variants = def.render.variants ? [...def.render.variants] : []
          variants.push(selectedImage)
          def.render.variants = variants
          break
        }
        case 'gridCell': {
          // Create or update a related sprite entry for this grid cell
          const grid = def.render.grid
          if (!grid) break
          const cellIndex = target.row * grid.cols + target.col
          const relatedKey = `${spriteKey}-${cellIndex + 1}`

          // Create the related entry with the same properties as the parent
          const relatedDef = structuredClone(def)
          relatedDef.render = {
            ...relatedDef.render,
            base: selectedImage,
            grid: undefined,
            variants: undefined,
            animations: undefined,
          }

          if (category === 'entities') {
            next.entities[relatedKey] = relatedDef
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(next.tiles[category] as Record<string, any>)[relatedKey] = relatedDef
          }
          break
        }
      }

      return next
    })

    setDirty(true)
    setIsOpen(false)
    setTarget(null)
  }, [selectedImage, target, category, spriteKey, setRegistry, setDirty, setIsOpen, setTarget])

  const cellProps = useMemo(
    () => ({
      images: filteredImages,
      columnCount,
      selectedImage,
      onSelect: handleSelect,
    }),
    [filteredImages, columnCount, selectedImage, handleSelect],
  )

  if (!isOpen) return null

  const title = getTitle(target)

  return (
    <s.Overlay onClick={handleOverlayClick}>
      <s.Modal>
        <s.Header>
          <s.Title>{title}</s.Title>
          <s.CloseButton onClick={handleClose} aria-label="Close image picker">
            x
          </s.CloseButton>
        </s.Header>
        <s.SearchRow>
          <s.SearchInput
            type="text"
            placeholder="Filter by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </s.SearchRow>
        <s.GridContainer ref={containerRef}>
          {filteredImages.length === 0 ? (
            <s.EmptyMessage>{search ? 'No images match your filter' : 'No unassigned images'}</s.EmptyMessage>
          ) : (
            <Grid
              cellComponent={CellRenderer}
              cellProps={cellProps}
              columnCount={columnCount}
              columnWidth={CELL_WIDTH}
              rowCount={rowCount}
              rowHeight={CELL_HEIGHT}
              style={{ width: containerSize.width, height: containerSize.height }}
              overscanCount={5}
            />
          )}
        </s.GridContainer>
        <s.Footer>
          <s.CountLabel>
            {filteredImages.length} unassigned image{filteredImages.length !== 1 ? 's' : ''}
            {search && ` (filtered from ${unassignedImages.length})`}
          </s.CountLabel>
          <s.FooterActions>
            <s.CancelButton onClick={handleClose}>Cancel</s.CancelButton>
            <s.ConfirmButton onClick={handleConfirm} disabled={!selectedImage}>
              Select
            </s.ConfirmButton>
          </s.FooterActions>
        </s.Footer>
      </s.Modal>
    </s.Overlay>
  )
}

export default ImagePicker
