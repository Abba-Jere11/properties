"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp, Download } from "lucide-react"

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Scroll to top when button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isVisible && (
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground ">
            <a href="/House Purchase Application Package (17).pdf" download="ThinkLab Estate Application Form.pdf">
              <Download className="w-4 h-4 mr-2" />
              Download PDF Form
            </a>
          </Button>
      )}
    </div>
  )
}
