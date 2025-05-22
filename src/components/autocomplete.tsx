'use client'

import { useState, useEffect, RefObject, useRef, memo } from 'react'
import { Input } from '@/components/ui/input'

interface AutoCompleteProps {
  value?: string
  handleChange?: ((value: string) => void) | null
  getValue?: ((value: string) => void) | null
  data: string[]
  ref?: RefObject<HTMLInputElement | null> | ((el: HTMLInputElement | null) => void) | null
  disabled: boolean
  placeholder?: string
}

export default memo(function Autocomplete({
  value = '',
  handleChange = null,
  getValue = null,
  data = [],
  ref = null,
  disabled,
  placeholder,
}: AutoCompleteProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isOver, setOver] = useState(false)

  const blockRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (data.length) {
      setSuggestions(data)

      if (isLoading) setIsLoading(false)
    } else setSuggestions([])
  }, [data, query])

  useEffect(() => {
    const bodyHeight = window.document.body.clientHeight
    const inputYPosition = blockRef.current!.getBoundingClientRect().top!

    if (bodyHeight - inputYPosition - window.scrollY < 350) setOver(true)
  }, [isFocused])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    setQuery(newValue)
    setSelectedIndex(-1)

    if (handleChange) {
      handleChange(newValue)

      setIsLoading(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      setQuery(suggestions[selectedIndex])
      setSuggestions([])
      setSelectedIndex(-1)

      getValue?.(suggestions[selectedIndex])
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setSelectedIndex(-1)
    } else if (e.key === 'Tab') {
      if (!query) return

      setTimeout(() => getValue?.(query), 200)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleChange?.(suggestion)
    setSuggestions([])
    setSelectedIndex(-1)

    getValue?.(suggestion)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow for click events on suggestions
    setTimeout(() => {
      setIsFocused(false)
      setSuggestions([])
      setSelectedIndex(-1)
    }, 200)
  }

  return (
    <div ref={blockRef} className="relative">
      <div>
        <Input
          type="text"
          placeholder={placeholder || 'Search...'}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="focus-visible:focus"
          disabled={disabled}
          aria-label="Search input"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-expanded={suggestions.length > 0}
          ref={ref}
        />
      </div>
      {isLoading && isFocused && (
        <div className="mt-2 p-2 bg-background border rounded-md shadow-sm absolute z-10" aria-live="polite">
          Loading...
        </div>
      )}
      {suggestions.length > 0 && !isLoading && isFocused && (
        <ul
          id="suggestions-list"
          className={`py-1 bg-background border rounded-md shadow-sm absolute ${isOver ? 'bottom-12' : 'top-12'} z-10`}
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion + index}
              className={`px-4 py-2 cursor-pointer hover:bg-muted ${index === selectedIndex ? 'bg-muted' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})
