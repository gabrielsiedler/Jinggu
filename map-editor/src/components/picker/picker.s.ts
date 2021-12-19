import styled from 'styled-components'

interface PickerProps {
  pos: number[]
}

export const Picker = styled.div(
  ({ pos }: PickerProps) => `
  width: 230px;
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
  overflow-x: auto;

  > div {
    margin: 5px 5px 0 0;
    position: relative;
    cursor: pointer;

    svg {
      display: none;
      color: white;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      filter: drop-shadow(0 0 1px #000);
    }

    &:hover {
      img {
        filter: blur(0.5px) brightness(0.5);
      }

      svg {
        display: flex;
      }
    }
  }
`

export const Suggestions = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  max-height: 100px;
  overflow-y: auto;
  position: relative;

  > div {
    margin: 5px 5px 0 0;
    position: relative;
    cursor: pointer;

    svg {
      display: none;
      color: white;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      filter: drop-shadow(0 0 1px #000);
    }

    &:hover {
      img {
        filter: blur(0.5px) brightness(0.5);
      }

      svg {
        display: flex;
      }
    }
  }
`

export const Container = styled.div`
  flex: 1;
  padding: 10px 10px 0 10px;

  input {
    margin-bottom: 5px;
  }
`

export const Section = styled.div`
  font-size: 14px;

  &:not(:first-child) {
    margin-top: 15px;
  }

  p {
    margin-bottom: 5px;
    font-weight: 600;
  }
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
