import styled from 'styled-components'

export const Picker = styled.div`
  width: 175px;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export const Suggestion = styled.div(
  ({ selected }: { selected: boolean }) => `
  padding: 1px;
  border: 2px solid ${selected ? 'red' : 'transparent'};
`,
)

export const Suggestions = styled.div`
  max-height: calc(100vh - 50px);
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  overflow-y: auto;
  position: relative;
  padding: 5px;

  input {
    margin-bottom: 10px;
  }

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
