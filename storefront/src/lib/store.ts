import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sdk, MedusaCart, MedusaLineItem } from './medusa'

interface CartState {
  cart: MedusaCart | null
  isOpen: boolean
  isLoading: boolean
  regionId: string | null

  // Actions
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  setRegion: (regionId: string) => void
  fetchCart: () => Promise<void>
  createCart: () => Promise<void>
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      isLoading: false,
      regionId: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setRegion: (regionId: string) => set({ regionId }),

      fetchCart: async () => {
        const { cart } = get()
        if (!cart?.id) return

        try {
          set({ isLoading: true })
          const response = await sdk.store.cart.retrieve(cart.id)
          set({ cart: response.cart as unknown as MedusaCart })
        } catch (error) {
          console.error('Failed to fetch cart:', error)
          // Cart might not exist anymore, clear it
          set({ cart: null })
        } finally {
          set({ isLoading: false })
        }
      },

      createCart: async () => {
        const { regionId } = get()

        try {
          set({ isLoading: true })
          const response = await sdk.store.cart.create({
            region_id: regionId || undefined,
          })
          set({ cart: response.cart as unknown as MedusaCart })
        } catch (error) {
          console.error('Failed to create cart:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      addItem: async (variantId: string, quantity: number) => {
        let { cart } = get()

        try {
          set({ isLoading: true })

          // Create cart if it doesn't exist
          if (!cart?.id) {
            await get().createCart()
            cart = get().cart
          }

          if (!cart?.id) {
            throw new Error('Failed to create cart')
          }

          const response = await sdk.store.cart.createLineItem(cart.id, {
            variant_id: variantId,
            quantity,
          })

          set({ cart: response.cart as unknown as MedusaCart, isOpen: true })
        } catch (error) {
          console.error('Failed to add item:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      updateItem: async (lineItemId: string, quantity: number) => {
        const { cart } = get()
        if (!cart?.id) return

        try {
          set({ isLoading: true })
          const response = await sdk.store.cart.updateLineItem(cart.id, lineItemId, {
            quantity,
          })
          set({ cart: response.cart as unknown as MedusaCart })
        } catch (error) {
          console.error('Failed to update item:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      removeItem: async (lineItemId: string) => {
        const { cart } = get()
        if (!cart?.id) return

        try {
          set({ isLoading: true })
          const response = await sdk.store.cart.deleteLineItem(cart.id, lineItemId)
          set({ cart: response.cart as unknown as MedusaCart })
        } catch (error) {
          console.error('Failed to remove item:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      clearCart: () => {
        set({ cart: null })
      },
    }),
    {
      name: 'pyh-cart-storage',
      partialize: (state) => ({
        cart: state.cart ? { id: state.cart.id } : null,
        regionId: state.regionId,
      }),
    }
  )
)

// Hook to get cart items count
export function useCartItemsCount(): number {
  const cart = useCartStore((state) => state.cart)
  return cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
}

// Hook to get cart total
export function useCartTotal(): number {
  const cart = useCartStore((state) => state.cart)
  return cart?.total || 0
}
