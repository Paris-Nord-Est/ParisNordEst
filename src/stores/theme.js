/**
 * Theme Store
 * Centralized access to BigCartel theme configuration
 */

import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    // Store info
    store: {
      name: '',
      currency: 'EUR',
      website: '',
      moneyFormat: '{{amount}} EUR'
    },

    // Navigation pages
    pages: [],

    // Categories for filtering
    categories: [],

    // Navigation links
    navigation: {
      products: '/products',
      contact: '/contact',
      home: '/'
    },

    // Theme display options
    options: {
      showSoldOut: true,
      productImageZoom: false
    },

    // Theme colors (from BigCartel settings)
    colors: {
      backgroundColor: '#ffffff',
      primaryTextColor: '#000000',
      accentColor: '#000000'
    },

    // Initialized flag
    initialized: false
  }),

  getters: {
    /**
     * Get store name
     */
    storeName: (state) => state.store.name,

    /**
     * Get all custom pages
     */
    customPages: (state) => state.pages,

    /**
     * Get categories for product filtering
     */
    productCategories: (state) => state.categories,

    /**
     * Format price using store's money format
     */
    formatPrice: (state) => (cents) => {
      const amount = (cents / 100).toFixed(2)
      return state.store.moneyFormat.replace('{{amount}}', amount)
    }
  },

  actions: {
    /**
     * Initialize theme store from window.BIGCARTEL_DATA
     * Called once on app mount
     */
    init() {
      if (this.initialized) return

      const data = window.BIGCARTEL_DATA
      if (!data) {
        console.warn('BIGCARTEL_DATA not found on window')
        return
      }

      // Store info
      if (data.store) {
        this.store = {
          name: data.store.name || '',
          currency: data.store.currency || 'EUR',
          website: data.store.website || '',
          moneyFormat: data.store.moneyFormat || '{{amount}} EUR'
        }
      }

      // Pages
      if (data.pages) {
        this.pages = data.pages
      }

      // Categories
      if (data.categories) {
        this.categories = data.categories
      }

      // Navigation
      if (data.navigation) {
        this.navigation = {
          ...this.navigation,
          ...data.navigation
        }
      }

      // Theme options
      if (window.themeOptions) {
        this.options = {
          ...this.options,
          ...window.themeOptions
        }
      }

      // Theme colors
      if (window.themeColors) {
        this.colors = {
          ...this.colors,
          ...window.themeColors
        }
      }

      this.initialized = true
    },

    /**
     * Get a page by permalink
     */
    getPageByPermalink(permalink) {
      return this.pages.find((p) => p.permalink === permalink)
    },

    /**
     * Get a category by permalink
     */
    getCategoryByPermalink(permalink) {
      return this.categories.find((c) => c.permalink === permalink)
    }
  }
})

export default useThemeStore
