'use client'

import Image from 'next/image'

import { Check, Minus } from 'lucide-react'
import { useTheme } from 'next-themes'

const items = [
  { id: 'radio-18-r1', value: 'light', label: 'Light', image: '/theme/ui-light.webp' },
  { id: 'radio-18-r2', value: 'dark', label: 'Dark', image: '/theme/ui-dark.webp' },
  { id: 'radio-18-r3', value: 'system', label: 'System', image: '/theme/ui-system.webp' },
]

export default function ThemeToggleSection() {
  const { theme, setTheme } = useTheme()

  const handleCheckedChange = (value) => {
    setTheme(value)
  }

  return (
    <div className="flex gap-3">
      {items.map((item) => {
        const isActive = theme === item.value

        return (
          <div onClick={() => handleCheckedChange(item.value)} key={item.id}>
            <Image
              src={item.image}
              alt={item.label}
              width={88}
              height={70}
              className={`relative cursor-pointer overflow-hidden rounded-lg border border-input shadow-sm shadow-black/5 outline-offset-2 transition-colors hover:scale-105 ${isActive ? 'border-ring bg-accent' : ''}`}
            />
            <span
              className={`mt-2 flex items-center gap-1 text-xs font-medium ${!isActive ? 'text-muted-foreground/70' : ''}`}
            >
              {isActive ? <Check size={16} strokeWidth={2} /> : <Minus size={16} strokeWidth={2} />}
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
