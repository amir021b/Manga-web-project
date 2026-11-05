import { useState } from 'react'

export function useDebounce(value) {
  const [debouncedValue] = useState(value)

  return debouncedValue
}
