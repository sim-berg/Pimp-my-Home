'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBagIcon, Bars3Icon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, useCartItemsCount } from '@/lib/store'
import { useLanguage } from '@/lib/language-context'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { clsx } from 'clsx'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const openCart = useCartStore((state) => state.openCart)
  const itemsCount = useCartItemsCount()
  const { t } = useLanguage()

  const navigation = [
    { name: t.nav.home, href: '/' },
    { name: t.nav.shop, href: '/products' },
    { name: t.nav.crystals, href: '/products?category=crystals' },
    { name: t.nav.lamps, href: '/products?category=lamps' },
    { name: t.nav.live, href: '/live', isLive: true },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-cave-darkest/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-crystal-purple/5'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-crystal-purple via-crystal-teal to-crystal-pink flex items-center justify-center shadow-glow-purple"
            >
              <SparklesIcon className="w-6 h-6 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-crystal-purple via-crystal-teal to-crystal-pink opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gradient">Pimp your Home</span>
              <span className="block text-[10px] text-gray-500 tracking-widest uppercase">Crystal Magic</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={clsx(
                    'relative px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-all duration-300 group',
                    item.isLive && 'flex items-center gap-2'
                  )}
                >
                  {item.isLive && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                  {item.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-crystal-purple to-crystal-teal transition-all duration-300 group-hover:w-3/4 rounded-full" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className="relative p-3 rounded-xl glass glass-hover group"
              aria-label={t.nav.cart}
            >
              <ShoppingBagIcon className="w-6 h-6 text-gray-300 group-hover:text-crystal-purple transition-colors" />
              <AnimatePresence>
                {itemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-crystal-purple to-crystal-pink rounded-full flex items-center justify-center text-xs font-bold shadow-glow-purple"
                  >
                    {itemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded-xl glass glass-hover lg:hidden"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Bars3Icon className="w-6 h-6 text-gray-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="glass rounded-2xl p-4 mt-4 space-y-2">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={clsx(
                        'flex items-center gap-3 py-3 px-4 text-gray-300 hover:text-white hover:bg-crystal-purple/20 rounded-xl transition-all duration-300',
                        item.isLive && 'justify-between'
                      )}
                    >
                      <span>{item.name}</span>
                      {item.isLive && (
                        <span className="badge badge-live text-[10px]">LIVE</span>
                      )}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2 border-t border-white/10">
                  <LanguageToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
