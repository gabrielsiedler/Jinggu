import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'
import { registryAtom, dirtyAtom } from '../../atoms/registry'
import { assignedImagesAtom, unassignedImagesAtom, allImageFilenamesAtom } from '../../atoms/images'
import { saveStatusAtom, saveErrorAtom } from '../../atoms/ui'
import { saveRegistry } from '../../api/spriteApi'
import * as s from './statusbar.s'

const StatusBar = () => {
  const registry = useAtomValue(registryAtom)
  const [dirty, setDirty] = useAtom(dirtyAtom)
  const allImages = useAtomValue(allImageFilenamesAtom)
  const assignedImages = useAtomValue(assignedImagesAtom)
  const unassignedImages = useAtomValue(unassignedImagesAtom)
  const [saveStatus, setSaveStatus] = useAtom(saveStatusAtom)
  const [saveError, setSaveError] = useAtom(saveErrorAtom)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleSave = useCallback(async () => {
    if (!dirty || saveStatus === 'saving') return

    setSaveStatus('saving')
    setSaveError(null)

    try {
      await saveRegistry(registry)
      setDirty(false)
      setSaveStatus('success')

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        setSaveStatus('idle')
        timerRef.current = null
      }, 3000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setSaveStatus('error')
      setSaveError(message)
    }
  }, [dirty, saveStatus, registry, setDirty, setSaveStatus, setSaveError])

  const statusLabel = () => {
    switch (saveStatus) {
      case 'saving':
        return <s.StatusText $variant="saving">Saving...</s.StatusText>
      case 'success':
        return <s.StatusText $variant="success">Saved!</s.StatusText>
      case 'error':
        return <s.StatusText $variant="error">{saveError ?? 'Save failed'}</s.StatusText>
      default:
        return dirty ? <s.StatusText $variant="idle">Unsaved changes</s.StatusText> : null
    }
  }

  return (
    <s.Bar>
      <s.Left>
        <s.Title>Sprite Editor</s.Title>
        {dirty && <s.DirtyIndicator title="Unsaved changes" />}
      </s.Left>
      <s.Center>
        <s.ImageCount>
          {assignedImages.size} assigned / {unassignedImages.length} unassigned / {allImages.length} total
        </s.ImageCount>
      </s.Center>
      <s.Right>
        {statusLabel()}
        <s.SaveButton
          onClick={handleSave}
          disabled={!dirty || saveStatus === 'saving'}
          $saving={saveStatus === 'saving'}
        >
          Save
        </s.SaveButton>
      </s.Right>
    </s.Bar>
  )
}

export default StatusBar
