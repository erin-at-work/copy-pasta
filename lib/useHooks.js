import { useEffect } from "react";

export function useKeyboardEvent(key, callback, args) {
  useEffect(() => {
    const handler = function(event) {
      if (event.key === key) {
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [args])
}
