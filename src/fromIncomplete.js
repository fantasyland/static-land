import {curryAll} from './utils'
import {deriveAll} from './derive'

export default function fromIncomplete(T) {
  return curryAll(deriveAll(T))
}
