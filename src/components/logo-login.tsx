
import { cn } from "@/lib/utils"

interface LogoProps {
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function LogoLogin({ width = 200, height = 80, className, priority = true }: LogoProps) {
  return (
    <div className={cn("", className)}>
      <img
        src="/Thinklab properties logo flat[1].png"
        alt="Think-Lab Group - Innovation, Development, Finance"
        width={width}
        height={height}
        // className="object-contain"
      />
    </div>
  )
}
