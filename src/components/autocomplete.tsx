'use client'

import { useState, useEffect, RefObject } from 'react'
import { Input } from '@/components/ui/input'

interface AutoCompleteProps {
  value?: string
  handleChange?: (value: string) => void
  getValue?: (value: string) => void
  data: string[]
  ref?: RefObject<HTMLInputElement | null>
  disabled: boolean
  label?: string
}

export default function Autocomplete({ value = '', handleChange, getValue, data = [], ref, disabled, label }: AutoCompleteProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (data.length) {
      setSuggestions(data)

      if (isLoading) setIsLoading(false)
    } else setSuggestions([])
  }, [data, query])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    setQuery(newValue)
    handleChange?.(newValue)
    setSelectedIndex(-1)
    setIsLoading(true)
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
    <div>
      <div className="relative">
        <Input
          type="text"
          placeholder={label || 'Search...'}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pr-10"
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
        <ul id="suggestions-list" className="mt-2 bg-background border rounded-md shadow-sm absolute z-10" role="listbox">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
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
}
