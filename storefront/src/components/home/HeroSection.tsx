'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/lib/language-context'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline'

// Crystal background configurations
const crystalConfigs = [
  {
    src: '/crystal1.png',
    className: 'crystal-glow',
    position: { left: '5%', top: '15%' },
    size: { width: 180, height: 180 },
    rotation: -15,
    floatDuration: 8,
    floatDelay: 0,
  },
  {
    src: '/crystal2.png',
    className: 'crystal-glow-teal',
    position: { right: '8%', top: '20%' },
    size: { width: 150, height: 150 },
    rotation: 25,
    floatDuration: 10,
    floatDelay: 1,
  },
  {
    src: '/crystal3.png',
    className: 'crystal-glow-pink',
    position: { left: '10%', bottom: '20%' },
    size: { width: 140, height: 140 },
    rotation: 45,
    floatDuration: 7,
    floatDelay: 2,
  },
  {
    src: '/crystal1.png',
    className: 'crystal-glow-teal',
    position: { right: '5%', bottom: '25%' },
    size: { width: 120, height: 120 },
    rotation: -30,
    floatDuration: 9,
    floatDelay: 0.5,
  },
  {
    src: '/crystal2.png',
    className: 'crystal-glow',
    position: { left: '25%', top: '60%' },
    size: { width: 100, height: 100 },
    rotation: 60,
    floatDuration: 11,
    floatDelay: 1.5,
  },
  {
    src: '/crystal3.png',
    className: 'crystal-glow-pink',
    position: { right: '20%', top: '55%' },
    size: { width: 90, height: 90 },
    rotation: -45,
    floatDuration: 6,
    floatDelay: 2.5,
  },
]

export function HeroSection() {
  const { t, locale } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Crystal Background Images */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {crystalConfigs.map((crystal, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              ...crystal.position,
              zIndex: 1,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.05, 1],
              y: [0, -20, 0],
              rotate: [crystal.rotation, crystal.rotation + 5, crystal.rotation],
            }}
            transition={{
              duration: crystal.floatDuration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: crystal.floatDelay,
            }}
          >
            <Image
              src={crystal.src}
              alt=""
              width={crystal.size.width}
              height={crystal.size.height}
              className={`${crystal.className} opacity-60`}
              style={{
                transform: `rotate(${crystal.rotation}deg)`,
              }}
            />
          </motion.div>
        ))}

        {/* Ambient glow orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-32 h-32 rounded-full"
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? 'rgba(124, 58, 237, 0.15)' : 'rgba(20, 184, 166, 0.15)'
              } 0%, transparent 70%)`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124, 58, 237, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 58, 237, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
            className="mb-8 flex justify-center"
          >
            <motion.div
              animate={{
                filter: [
                  'drop-shadow(0 0 30px rgba(168, 85, 247, 0.5))',
                  'drop-shadow(0 0 50px rgba(45, 212, 191, 0.6))',
                  'drop-shadow(0 0 40px rgba(236, 72, 153, 0.5))',
                  'drop-shadow(0 0 30px rgba(168, 85, 247, 0.5))',
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Image
                src="/logo.png"
                alt="Pimp your Home"
                width={280}
                height={280}
                className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-sm text-crystal-purple-light mb-6 border border-crystal-purple/30"
          >
            <span className="w-2 h-2 rounded-full bg-crystal-teal animate-pulse" />
            {t.hero.badge}
            <span className="w-2 h-2 rounded-full bg-crystal-purple animate-pulse" />
          </motion.span>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="block text-white"
            >
              {t.hero.title1}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="block text-gradient text-shadow-crystal"
            >
              {t.hero.title2}
            </motion.span>
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {t.hero.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-crystal group"
              >
                <span className="flex items-center gap-2">
                  {t.hero.cta}
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>
            <Link href="/live">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-crystal-outline group"
              >
                <span className="flex items-center gap-2">
                  <span className="relative">
                    <PlayIcon className="w-5 h-5" />
                    <span className="absolute inset-0 w-5 h-5 bg-red-500 rounded-full animate-ping opacity-30" />
                  </span>
                  {t.hero.watchLive}
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[
              { value: '500+', labelDe: 'Kristalle verkauft', labelEn: 'Crystals sold' },
              { value: '4.9★', labelDe: 'Bewertung', labelEn: 'Rating' },
              { value: '24h', labelDe: 'Support', labelEn: 'Support' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {locale === 'de' ? stat.labelDe : stat.labelEn}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-gray-600 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-crystal-purple rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
