import React, { useEffect, useState } from 'react';

const ClientOnly:React.FC<{}> = ({ children }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <>{children}</> : null
}

export default ClientOnly
