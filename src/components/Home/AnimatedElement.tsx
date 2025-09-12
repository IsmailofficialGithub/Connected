'use client'
import { useEffect, useRef, useState } from 'react'

interface AnimatedElementProps {
  children: React.ReactNode
  direction: 'left' | 'right' | 'up' | 'down'
  delay?: number
  className?: string
}

export function AnimatedElement({ children, direction, delay = 0, className = '' }: AnimatedElementProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true)
            setHasAnimated(true)
          }, delay)
        } else if (!entry.isIntersecting && hasAnimated) {
          // Reset animation when scrolling back up
          setIsVisible(false)
          setTimeout(() => {
            setHasAnimated(false)
          }, 300)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [delay, hasAnimated])

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out'
    
    if (!isVisible) {
      switch (direction) {
        case 'left':
          return `${baseClasses} -translate-x-full opacity-0`
        case 'right':
          return `${baseClasses} translate-x-full opacity-0`
        case 'up':
          return `${baseClasses} translate-y-8 opacity-0`
        case 'down':
          return `${baseClasses} -translate-y-8 opacity-0`
        default:
          return `${baseClasses} opacity-0`
      }
    }
    
    return `${baseClasses} translate-x-0 translate-y-0 opacity-100`
  }

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  )
}
