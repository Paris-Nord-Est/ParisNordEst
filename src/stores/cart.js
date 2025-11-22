/**
 * Cart Store
 * Reactive cart state management using Pinia
 */

import { defineStore } from 'pinia'
import { useBigCartel } from '../composables/useBigCartel'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    count: window.BIGCARTEL_DATA?.cart?.count || 0,
    total: 0,
    subtotal: 0,
    discount: 0,
    shareableLink: '',
    loading: false,
    error: null
  }),

  getters: {
    /**
     * Check if cart is empty
     */
    isEmpty: (state) => state.count === 0,

    /**
     * Get formatted total price
     */
    formattedTotal: (state) => {
      const { formatPrice } = useBigCartel()
      return formatPrice(state.total)
    },

    /**
     * Get formatted subtotal price
     */
    formattedSubtotal: (state) => {
      const { formatPrice } = useBigCartel()
      return formatPrice(state.subtotal)
    }
  },

  actions: {
    /**
     * Refresh cart state from BigCartel API
     */
    async refresh() {
      const { refreshCart } = useBigCartel()

      this.loading = true
      this.error = null

      try {
        const cart = await refreshCart()
        this.updateFromCart(cart)
      } catch (err) {
        this.error = err.message
        console.error('Failed to refresh cart:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * Add item to cart
     * @param {number|string} optionId - Product option ID
     * @param {number} quantity - Quantity to add
     */
    async addItem(optionId, quantity = 1) {
      const { addToCart } = useBigCartel()

      this.loading = true
      this.error = null

      try {
        const cart = await addToCart(optionId, quantity)
        this.updateFromCart(cart)
        return true
      } catch (err) {
        this.error = err.message
        console.error('Failed to add to cart:', err)
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Update item quantity in cart
     * @param {number|string} itemId - Cart item ID
     * @param {number} quantity - New quantity
     */
    async updateItem(itemId, quantity) {
      const { updateCartItem } = useBigCartel()

      this.loading = true
      this.error = null

      try {
        const cart = await updateCartItem(itemId, quantity)
        this.updateFromCart(cart)
        return true
      } catch (err) {
        this.error = err.message
        console.error('Failed to update cart item:', err)
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Remove item from cart
     * @param {number|string} itemId - Cart item ID
     */
    async removeItem(itemId) {
      const { removeCartItem } = useBigCartel()

      this.loading = true
      this.error = null

      try {
        const cart = await removeCartItem(itemId)
        this.updateFromCart(cart)
        return true
      } catch (err) {
        this.error = err.message
        console.error('Failed to remove cart item:', err)
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Update local state from cart API response
     * @param {Object} cart - Cart object from BigCartel API
     */
    updateFromCart(cart) {
      if (!cart) return

      this.items = cart.items || []
      this.count = cart.item_count || cart.count || 0
      this.total = cart.total || 0
      this.subtotal = cart.subtotal || cart.total || 0
      this.discount = cart.discount || 0
      this.shareableLink = cart.shareable_link || ''

      // Update the global cart count for Navigation component
      if (window.BIGCARTEL_DATA?.cart) {
        window.BIGCARTEL_DATA.cart.count = this.count
      }
    },

    /**
     * Initialize cart from window data (for SSR hydration)
     */
    initFromWindow() {
      if (window.BIGCARTEL_DATA?.cart) {
        this.count = window.BIGCARTEL_DATA.cart.count || 0
      }
    }
  }
})

export default useCartStore
