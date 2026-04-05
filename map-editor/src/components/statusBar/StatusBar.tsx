import * as s from './statusBar.s'

interface StatusBarProps {
  hoveredTile: { x: number; y: number } | null
  zoomPercent: number
  onResetZoom: () => void
}

export const StatusBar = ({ hoveredTile, zoomPercent, onResetZoom }: StatusBarProps) => (
  <s.StatusBarContainer role="status" aria-live="polite">
    <s.CoordinateDisplay aria-label="Current tile coordinates">
      {hoveredTile ? `(${hoveredTile.x}, ${hoveredTile.y})` : '(-, -)'}
    </s.CoordinateDisplay>
    <s.Spacer />
    <s.ZoomDisplay aria-label="Current zoom level">{zoomPercent}%</s.ZoomDisplay>
    <s.ResetZoomButton onClick={onResetZoom}>Reset Zoom</s.ResetZoomButton>
  </s.StatusBarContainer>
)
