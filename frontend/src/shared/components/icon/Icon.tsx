import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconProps } from './Icon.types'

export function Icon(props: IconProps) {
  return <FontAwesomeIcon {...props} />
}
