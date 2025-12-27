'use client'

import { clsx } from 'clsx'
import { MedusaProductOption, MedusaProductVariant } from '@/lib/medusa'

interface VariantSelectorProps {
  options: MedusaProductOption[]
  variants: MedusaProductVariant[]
  selectedOptions: Record<string, string>
  onOptionChange: (optionTitle: string, value: string) => void
}

export function VariantSelector({
  options,
  variants,
  selectedOptions,
  onOptionChange,
}: VariantSelectorProps) {
  // Check if a combination is available
  const isOptionAvailable = (optionTitle: string, value: string): boolean => {
    const testOptions = { ...selectedOptions, [optionTitle]: value }
    return variants.some((variant) =>
      Object.entries(testOptions).every(
        ([key, val]) => variant.options[key] === val
      )
    )
  }

  if (options.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id}>
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            {option.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.title] === value
              const isAvailable = isOptionAvailable(option.title, value)

              return (
                <button
                  key={value}
                  onClick={() => onOptionChange(option.title, value)}
                  disabled={!isAvailable}
                  className={clsx(
                    'px-4 py-2 rounded-lg border-2 transition-all',
                    isSelected
                      ? 'border-crystal-purple bg-crystal-purple/20 text-white shadow-glow-sm'
                      : 'border-cave-light hover:border-crystal-purple/50',
                    !isAvailable &&
                      'opacity-50 cursor-not-allowed line-through'
                  )}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
