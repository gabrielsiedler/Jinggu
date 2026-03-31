declare module 'react-selectable-fast' {
  import { Component, ReactNode } from 'react'

  interface TSelectableGroupProps {
    className?: string
    clickClassName?: string
    resetOnStart?: boolean
    tolerance?: number
    onSelectionFinish?: (items: any) => void
    onSelectionClear?: () => void
    ignoreList?: string[]
    style?: React.CSSProperties
    selectboxClassName?: string
    component?: string
    children?: ReactNode
  }

  class SelectableGroup extends Component<TSelectableGroupProps> {}

  interface TSelectableItemProps {
    selected?: boolean
    selectableKey?: string | number
  }

  function createSelectable<T>(component: React.ComponentType<T>): React.ComponentType<T & TSelectableItemProps>
}
