export interface EditorTileLayer {
  spriteKey: string
  category: string
  resolvedId: string
}

export interface EditorTile {
  layers: EditorTileLayer[]
}

export interface MapData {
  version: 2
  width: number
  height: number
  editorTiles: EditorTile[][]
  serverTiles: string[][][]
}
