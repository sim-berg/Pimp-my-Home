'use client'

import { Fragment, useEffect } from 'react'
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCartStore, useCartTotal } from '@/lib/store'
import { CartItem } from './CartItem'
import { formatPrice } from '@/lib/medusa'
import { useLanguage } from '@/lib/language-context'

export function CartDrawer() {
  const { t } = useLanguage()
  const { cart, isOpen, closeCart, fetchCart } = useCartStore()
  const total = useCartTotal()

  // Fetch cart on mount if we have a cart ID stored
  useEffect(() => {
    if (cart?.id) {
      fetchCart()
    }
  }, [])

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-cave-darkest/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-cave-deep shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                      <Dialog.Title className="text-lg font-semibold text-white flex items-center gap-2">
                        <ShoppingBagIcon className="w-6 h-6 text-crystal-purple" />
                        {t.cart.title}
                      </Dialog.Title>
                      <button
                        onClick={closeCart}
                        className="p-2 rounded-lg hover:bg-cave-light transition-colors"
                      >
                        <XMarkIcon className="w-6 h-6 text-gray-400" />
                      </button>
                    </div>

                    {/* Cart items */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      {!cart?.items || cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <ShoppingBagIcon className="w-16 h-16 text-gray-600 mb-4" />
                          <p className="text-gray-400 mb-4">{t.cart.empty}</p>
                          <button
                            onClick={closeCart}
                            className="btn-crystal-outline"
                          >
                            <span>{t.cart.continueShopping}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cart.items.map((item) => (
                            <CartItem key={item.id} item={item} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {cart?.items && cart.items.length > 0 && (
                      <div className="border-t border-white/10 px-6 py-4 space-y-4">
                        {/* Subtotal */}
                        <div className="flex justify-between text-base">
                          <span className="text-gray-400">{t.cart.subtotal}</span>
                          <span className="font-semibold text-white">
                            {formatPrice(cart.subtotal || 0)}
                          </span>
                        </div>

                        {/* Shipping & taxes note */}
                        <p className="text-sm text-gray-500">
                          {t.cart.shippingNote}
                        </p>

                        {/* Checkout button */}
                        <Link
                          href="/checkout"
                          onClick={closeCart}
                          className="btn-crystal w-full text-center"
                        >
                          <span>{t.cart.checkout}</span>
                        </Link>

                        {/* Continue shopping */}
                        <button
                          onClick={closeCart}
                          className="w-full text-center text-sm text-gray-400 hover:text-crystal-purple transition-colors"
                        >
                          {t.cart.continueShopping}
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
