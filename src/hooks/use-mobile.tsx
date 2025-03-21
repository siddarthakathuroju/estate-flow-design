
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    // Create handler function with debounce to improve performance
    const handleResize = () => {
      const mobileCheck = window.innerWidth < MOBILE_BREAKPOINT
      if (mobileCheck !== isMobile) {
        setIsMobile(mobileCheck)
      }
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Handle initial check
    handleResize()
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  return isMobile
}

// Alias for backward compatibility
export const useMobile = useIsMobile
