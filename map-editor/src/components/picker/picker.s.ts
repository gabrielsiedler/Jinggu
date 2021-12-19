import styled from 'styled-components'

interface PickerProps {
  pos: number[]
}

export const Picker = styled.div(
  ({ pos }: PickerProps) => `
  width: 200px;
  height: 200px;
  background-color: white;
  position: absolute;
  left: ${pos[0] ?? 0}px;
  top: ${pos[1] ?? 0}px;
  padding: 10px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
`,
)

export const Current = styled.div`
  display: flex;
  flex-shrink: 0;
  margin: 5px;

  img {
    margin: 0 5px;

    &:hover {
      opacity: 0.5;
    }
  }
`

export const Container = styled.div`
  flex: 1;
`
export const Buttons = styled.div``
