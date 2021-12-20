import * as s from './button.s'

interface ButtonProps {
  secondary?: boolean
  onClick?: any
  children: any
  style?: any
}

export const Button = ({ secondary, children, onClick, ...props }: ButtonProps) => {
  return (
    <s.Button secondary={secondary} onClick={onClick} {...props}>
      {children}
    </s.Button>
  )
}
