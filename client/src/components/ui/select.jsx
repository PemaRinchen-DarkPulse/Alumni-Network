import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = "Select"

export { Select }
