/**
 * BigCartel API Composable
 * Promisified wrapper around BigCartel's JavaScript API
 *
 * Usage:
 * const { findAllProducts, findProduct, addToCart } = useBigCartel()
 * const products = await findAllProducts()
 */

export const useBigCartel = () => {
  /**
   * Fetch all products from the store
   * @param {Object} params - Optional parameters for filtering
   * @returns {Promise<Array>} Array of product objects
   */
  const findAllProducts = (params = {}) => {
    return new Promise((resolve, reject) => {
      if (typeof Product === 'undefined') {
        reject(new Error('BigCartel Product API not available'))
        return
      }
      Product.findAll(params, (products) => {
        resolve(products || [])
      })
    })
  }

  /**
   * Fetch a single product by permalink
   * @param {string} permalink - Product permalink/slug
   * @returns {Promise<Object>} Product object
   */
  const findProduct = (permalink) => {
    return new Promise((resolve, reject) => {
      if (typeof Product === 'undefined') {
        reject(new Error('BigCartel Product API not available'))
        return
      }
      Product.find(permalink, (product) => {
        if (product) {
          resolve(product)
        } else {
          reject(new Error(`Product not found: ${permalink}`))
        }
      })
    })
  }

  /**
   * Search products by term
   * @param {string} term - Search term
   * @param {Object} params - Optional search parameters
   * @returns {Promise<Array>} Array of matching products
   */
  const searchProducts = (term, params = {}) => {
    return new Promise((resolve, reject) => {
      if (typeof Product === 'undefined') {
        reject(new Error('BigCartel Product API not available'))
        return
      }
      Product.search(term, params, (products) => {
        resolve(products || [])
      })
    })
  }

  /**
   * Add item to cart
   * @param {number|string} optionId - Product option ID
   * @param {number} quantity - Quantity to add (default: 1)
   * @returns {Promise<Object>} Updated cart object
   */
  const addToCart = (optionId, quantity = 1) => {
    return new Promise((resolve, reject) => {
      if (typeof Cart === 'undefined') {
        reject(new Error('BigCartel Cart API not available'))
        return
      }
      Cart.addItem(optionId, quantity, (cart) => {
        resolve(cart)
      })
    })
  }

  /**
   * Update cart item quantity
   * @param {number|string} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Updated cart object
   */
  const updateCartItem = (itemId, quantity) => {
    return new Promise((resolve, reject) => {
      if (typeof Cart === 'undefined') {
        reject(new Error('BigCartel Cart API not available'))
        return
      }
      Cart.updateItem(itemId, quantity, (cart) => {
        resolve(cart)
      })
    })
  }

  /**
   * Remove item from cart
   * @param {number|string} itemId - Cart item ID
   * @returns {Promise<Object>} Updated cart object
   */
  const removeCartItem = (itemId) => {
    return new Promise((resolve, reject) => {
      if (typeof Cart === 'undefined') {
        reject(new Error('BigCartel Cart API not available'))
        return
      }
      Cart.removeItem(itemId, (cart) => {
        resolve(cart)
      })
    })
  }

  /**
   * Refresh cart state from server
   * @returns {Promise<Object>} Current cart object
   */
  const refreshCart = () => {
    return new Promise((resolve, reject) => {
      if (typeof Cart === 'undefined') {
        reject(new Error('BigCartel Cart API not available'))
        return
      }
      Cart.refresh((cart) => {
        resolve(cart)
      })
    })
  }

  /**
   * Format price according to store currency settings
   * @param {number} cents - Price in cents
   * @returns {string} Formatted price string
   */
  const formatPrice = (cents) => {
    const format = window.BIGCARTEL_DATA?.store?.moneyFormat || '{{amount}} EUR'
    const amount = (cents / 100).toFixed(2)
    return format.replace('{{amount}}', amount)
  }

  /**
   * Get product image URL with size
   * @param {Object} image - Image object from product
   * @param {string} size - Size: 'thumb', 'medium', 'large', 'original'
   * @returns {string} Image URL
   */
  const getImageUrl = (image, size = 'large') => {
    if (!image) return null
    return image[size] || image.url || image.original
  }

  return {
    // Products
    findAllProducts,
    findProduct,
    searchProducts,

    // Cart
    addToCart,
    updateCartItem,
    removeCartItem,
    refreshCart,

    // Helpers
    formatPrice,
    getImageUrl
  }
}

export default useBigCartel
