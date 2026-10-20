import { useState } from 'react'

/**
 * Debounce a value so it only changes after it has stayed still for a while.
 * Later this will be used by the search page so we do not send a request
 * on every single keystroke.
 *
 * @param {*} value The value that should be debounced.
 * @returns {*} The debounced value (for now the value is returned unchanged).
 */
export function useDebounce(value) {
  const [debouncedValue] = useState(value)

  return debouncedValue
}
