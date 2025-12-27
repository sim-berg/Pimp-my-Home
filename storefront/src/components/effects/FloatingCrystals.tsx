'use client'

import { motion } from 'framer-motion'

const crystals = [
  { emoji: '💎', size: 'text-4xl', left: '10%', top: '20%', duration: 8, delay: 0 },
  { emoji: '🔮', size: 'text-3xl', left: '85%', top: '15%', duration: 10, delay: 2 },
  { emoji: '💜', size: 'text-2xl', left: '75%', top: '60%', duration: 7, delay: 1 },
  { emoji: '✨', size: 'text-3xl', left: '5%', top: '70%', duration: 9, delay: 3 },
  { emoji: '🌟', size: 'text-2xl', left: '90%', top: '80%', duration: 11, delay: 4 },
  { emoji: '💠', size: 'text-4xl', left: '20%', top: '85%', duration: 8, delay: 2 },
  { emoji: '🪻', size: 'text-3xl', left: '60%', top: '10%', duration: 10, delay: 1 },
  { emoji: '🌙', size: 'text-2xl', left: '40%', top: '75%', duration: 9, delay: 5 },
]

export function FloatingCrystals() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {crystals.map((crystal, index) => (
        <motion.div
          key={index}
          className={`absolute ${crystal.size} opacity-20`}
          style={{ left: crystal.left, top: crystal.top }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: crystal.duration,
            repeat: Infinity,
            delay: crystal.delay,
            ease: 'easeInOut',
          }}
        >
          {crystal.emoji}
        </motion.div>
      ))}
    </div>
  )
}
