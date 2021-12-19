import styled from 'styled-components'

interface ButtonProps {
  secondary?: boolean
}

export const Button = styled.button(
  ({ secondary }: ButtonProps) => `
  border: 0;
  outline: 0;
  color: ${secondary ? '#5750eb' : 'white'};
  background-color: ${secondary ? 'white' : '#5750eb'};
  border: 1px solid #5750eb;
  padding: 2px 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`,
)
