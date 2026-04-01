import { useState } from 'react'
import './App.css'
import * as s from './index.s'
import { SpriteRegistryV2 } from '@jinggu/shared'
import spriteRegistry from '@jinggu/shared/data/sprites.json'

const registry = spriteRegistry as unknown as SpriteRegistryV2

const App = () => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  const toggleEntry = (key: string) => {
    setExpandedEntry(expandedEntry === key ? null : key)
  }

  return (
    <s.App>
      <s.Section>
        <s.SectionTitle>Terrain</s.SectionTitle>
        <s.Repository>
          {Object.entries(registry.tiles.terrain).map(([key, def]) => (
            <s.EntryGroup key={key} onClick={() => toggleEntry(`terrain-${key}`)}>
              <s.EntryHeader>
                <s.Sprite src={`sprites/${def.render.base}.png`} />
                <s.EntryLabel>{key}</s.EntryLabel>
                {def.render.variants && <s.VariantCount>{def.render.variants.length} variants</s.VariantCount>}
              </s.EntryHeader>
              {expandedEntry === `terrain-${key}` && def.render.variants && (
                <s.VariantGrid>
                  {def.render.variants.map((v) => (
                    <s.RepositoryItem key={v} title={v}>
                      <img src={`sprites/${v}.png`} />
                    </s.RepositoryItem>
                  ))}
                </s.VariantGrid>
              )}
            </s.EntryGroup>
          ))}
        </s.Repository>
      </s.Section>

      <s.Section>
        <s.SectionTitle>Terrain Overlays</s.SectionTitle>
        <s.Repository>
          {Object.entries(registry.tiles.terrainOverlays).map(([key, def]) => (
            <s.EntryGroup key={key} onClick={() => toggleEntry(`overlay-${key}`)}>
              <s.EntryHeader>
                <s.Sprite src={`sprites/${def.render.base}.png`} />
                <s.EntryLabel>{key}</s.EntryLabel>
                {def.render.variants && <s.VariantCount>{def.render.variants.length} variants</s.VariantCount>}
              </s.EntryHeader>
              {expandedEntry === `overlay-${key}` && def.render.variants && (
                <s.VariantGrid>
                  {def.render.variants.map((v) => (
                    <s.RepositoryItem key={v} title={v}>
                      <img src={`sprites/${v}.png`} />
                    </s.RepositoryItem>
                  ))}
                </s.VariantGrid>
              )}
            </s.EntryGroup>
          ))}
        </s.Repository>
      </s.Section>

      <s.Section>
        <s.SectionTitle>Objects</s.SectionTitle>
        <s.Repository>
          {Object.entries(registry.tiles.objects).map(([key, def]) => (
            <s.EntryGroup key={key}>
              <s.EntryHeader>
                <s.Sprite src={`sprites/${def.render.base}.png`} />
                <s.EntryLabel>{key}</s.EntryLabel>
              </s.EntryHeader>
            </s.EntryGroup>
          ))}
        </s.Repository>
      </s.Section>

      <s.Section>
        <s.SectionTitle>Entities</s.SectionTitle>
        <s.Repository>
          {Object.entries(registry.entities).map(([key, def]) => (
            <s.EntryGroup key={key} onClick={() => toggleEntry(`entity-${key}`)}>
              <s.EntryHeader>
                <s.Sprite src={`sprites/${def.render.base}.png`} />
                <s.EntryLabel>{key}</s.EntryLabel>
              </s.EntryHeader>
              {expandedEntry === `entity-${key}` && def.render.animations && (
                <s.VariantGrid>
                  {Object.entries(def.render.animations).map(([animName, directions]) =>
                    Object.entries(directions).map(([dir, frames]) =>
                      (frames as string[]).map((frame) => (
                        <s.RepositoryItem key={frame} title={`${animName} ${dir}: ${frame}`}>
                          <img src={`sprites/${frame}.png`} />
                        </s.RepositoryItem>
                      )),
                    ),
                  )}
                </s.VariantGrid>
              )}
            </s.EntryGroup>
          ))}
        </s.Repository>
      </s.Section>
    </s.App>
  )
}

export default App
