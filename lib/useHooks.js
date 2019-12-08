import { useEffect } from "react";

export function useKeyboardEvent(key, callback, arg) {
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
  }, [arg])
}
