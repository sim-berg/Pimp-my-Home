'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language-context'
import { Locale } from '@/lib/i18n'
import { clsx } from 'clsx'

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage()

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'de', label: 'DE', flag: '🇩🇪' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
  ]

  return (
    <div className="flex items-center gap-1 p-1 rounded-full glass">
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          className={clsx(
            'relative px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            locale === lang.code
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-200'
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {locale === lang.code && (
            <motion.div
              layoutId="language-indicator"
              className="absolute inset-0 bg-crystal-purple rounded-full shadow-glow-sm"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <span>{lang.flag}</span>
            <span className="hidden sm:inline">{lang.label}</span>
          </span>
        </motion.button>
      ))}
    </div>
  )
}
