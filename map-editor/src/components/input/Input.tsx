import * as s from './input.s'

interface InputProps {
  placeholder?: string
  onChange: any
}

export const Input = ({ placeholder, onChange, ...props }: InputProps) => {
  return <s.Input placeholder={placeholder} onChange={onChange} {...props} />
}
