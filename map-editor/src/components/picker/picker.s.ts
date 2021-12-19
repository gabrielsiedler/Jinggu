import styled from 'styled-components'

interface PickerProps {
  pos: number[]
}

export const Picker = styled.div(
  ({ pos }: PickerProps) => `
  width: 200px;
  height: 300px;
  background-color: white;
  position: absolute;
  left: ${pos[0] ?? 0}px;
  top: ${pos[1] ?? 0}px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 5px 0px rgba(50, 50, 50, 0.5);
`,
)

export const Current = styled.div`
  display: flex;
  flex-shrink: 0;

  img {
    margin: 5px 5px 0 0;

    &:hover {
      opacity: 0.5;
    }
  }
`

export const Container = styled.div`
  flex: 1;
  padding: 10px;
`

export const Section = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`

export const Buttons = styled.div`
  padding: 10px;
  display: flex;
  justify-content: flex-end;

  > * {
    margin-left: 5px;
  }
`

export const Sprite = styled.img`
  display: flex;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
`

export const Title = styled.div`
  background-color: #5750eb;
  text-align: center;
  font-size: 18px;
  font-weight: 300;
  padding-bottom: 10px;
  padding: 10px;
  color: white;

  button {
    background-color: transparent;
    font-weight: 300;
    font-family: Lato;
    position: absolute;
    right: 10px;
    top: 0;
    color: white;
    font-size: 30px;
    border: 0;
    cursor: pointer;
    line-height: 30px;

    &:hover {
      opacity: 0.8;
    }
  }
`
