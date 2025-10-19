# BigCartel JavaScript API Documentation

> Extracted from: https://developers.bigcartel.com/api/themes#javascript-api

## Overview

The JavaScript API enables Ajax requests to retrieve and manipulate store data in JSON format. It operates independently without external library dependencies and functions exclusively within store environments.

**Implementation:**
```html
<script src="{{ 'api' | theme_js_url }}"></script>
```

---

## Product Methods

### Product.find(permalink, callback)

Retrieves a single product by its permalink identifier.

**Parameters:**
- `permalink` (string): The product's unique URL slug
- `callback` (function): Executes upon data retrieval with product object

**Example:**
```javascript
Product.find('my-tee', function(product) {
  console.log("I found " + product.name + "!");
});
```

**Return Object Structure:**
```javascript
{
  id: 112971528,
  name: "T-SHIRT PARIS NORD-EST - BLANC/ROSE FLUO",
  permalink: "t-shirt-paris-nord-est-blanc-rose-fluo",
  position: 1,
  url: "/product/t-shirt-paris-nord-est-blanc-rose-fluo",
  status: "active", // "active", "sold-out", "coming-soon"
  created_at: "2025-04-17T15:41:01.000Z",
  has_password_protection: false,
  images: [
    {
      url: "https://assets.bigcartel.com/product_images/...",
      width: 4160,
      height: 6240
    }
  ],
  price: 29,
  default_price: 29,
  tax: 0,
  on_sale: false,
  description: "Product description here",
  has_option_groups: false,
  options: [
    {
      id: 453489216,
      name: "SMALL",
      price: 29,
      sold_out: false,
      has_custom_price: false,
      option_group_values: []
    }
  ],
  artists: [],
  categories: [
    {
      id: 1412732633,
      name: "T-SHIRT",
      permalink: "t-shirt",
      url: "/category/t-shirt"
    }
  ],
  option_groups: []
}
```

---

### Product.findAll(params, callback)

Fetches an array containing all available products with optional filtering.

**Parameters:**
- `params` (object): Configuration options
  - `limit` (number): Maximum number of products to return
  - `page` (number): Page number for pagination
  - `category` (string): Filter by category permalink
- `callback` (function): Processes returned product array

**Examples:**
```javascript
// Get all products
Product.findAll({}, function(products) {
  console.log("I found " + products.length + " products!");
});

// Filter by category
Product.findAll({ category: 'tees' }, function(products) {
  console.log("I found " + products.length + " tees!");
});

// Pagination with limit
Product.findAll({ limit: 10, page: 1 }, function(products) {
  console.log("First 10 products:", products);
});
```

**Returns:** Array of product objects (same structure as `Product.find`)

---

### Product.search(term, params, callback)

Locates products matching specified search criteria.

**Parameters:**
- `term` (string): Search keyword to match against product names
- `params` (object): Optional filters
  - `limit` (number): Maximum results to return
  - `page` (number): Page number for pagination
  - `category` (string): Filter by category permalink
- `callback` (function): Handles results array

**Examples:**
```javascript
// Basic search
Product.search('shirt', {}, function(products) {
  console.log("I found " + products.length + " products matching 'shirt'!");
});

// Search with limit
Product.search('shirt', { limit: 5 }, function(products) {
  console.log("I found " + products.length + " shirts (max 5)!");
});

// Search within category
Product.search('noir', { category: 'casquette' }, function(products) {
  console.log("Found " + products.length + " black caps!");
});
```

---

### Product.findImage(url, size)

Generates image URLs at specified dimensions.

**Parameters:**
- `url` (string): Original image URL from product data
- `size` (string): Dimension preset

**Size Options:**
- `"thumb"` - 75x75 pixels
- `"medium"` - 175x175 pixels
- `"large"` - 300x300 pixels
- `undefined` or `null` - Original full size

**Example:**
```javascript
var imageUrl = "https://assets.bigcartel.com/product_images/402916965/...";

// Get thumbnail
var thumb = Product.findImage(imageUrl, 'thumb');
// Returns: https://assets.bigcartel.com/product_images/402916965/...?auto=format&fit=max&h=75&w=75

// Get large image
var large = Product.findImage(imageUrl, 'large');
// Returns: https://assets.bigcartel.com/product_images/402916965/...?auto=format&fit=max&h=300&w=300

// Get original
var original = Product.findImage(imageUrl);
// Returns: Original URL
```

---

## Cart Methods

### Cart.refresh(callback)

Retrieves the current cart state with item count and totals.

**Parameters:**
- `callback` (function): Receives cart object

**Example:**
```javascript
Cart.refresh(function(cart) {
  console.log("Cart has " + cart.item_count + " items");
  console.log("Total: " + cart.total);
});
```

**Cart Object Structure:**
```javascript
{
  item_count: 3,
  total: 111.00,
  items: [
    {
      id: 453489216,
      product_id: 112971528,
      product_name: "T-SHIRT PARIS NORD-EST",
      option_name: "SMALL",
      quantity: 2,
      price: 29.00,
      total: 58.00,
      url: "/product/t-shirt-paris-nord-est",
      image_url: "https://assets.bigcartel.com/..."
    }
  ]
}
```

---

### Cart.addItem(option_id, quantity, callback)

Adds a product option to the cart with specified quantity.

**Parameters:**
- `option_id` (number): The ID of the product option/variant to add
- `quantity` (number): Number of items to add (default: 1)
- `callback` (function): Called after item is added, receives updated cart

**Example:**
```javascript
// Add 1 item
Cart.addItem(453489216, 1, function(cart) {
  console.log("Item added! Cart now has " + cart.item_count + " items");
});

// Add multiple items
Cart.addItem(453489219, 3, function(cart) {
  console.log("Added 3 items to cart");
});
```

---

### Cart.updateItem(option_id, quantity, callback)

Modifies the quantity of an existing cart item.

**Parameters:**
- `option_id` (number): The ID of the product option in the cart
- `quantity` (number): New quantity (use 0 to remove)
- `callback` (function): Receives updated cart object

**Example:**
```javascript
// Update quantity to 5
Cart.updateItem(453489216, 5, function(cart) {
  console.log("Updated item quantity");
});

// Set to 0 to remove
Cart.updateItem(453489216, 0, function(cart) {
  console.log("Item removed from cart");
});
```

---

### Cart.removeItem(option_id, callback)

Removes an item from the cart entirely.

**Parameters:**
- `option_id` (number): The ID of the product option to remove
- `callback` (function): Receives updated cart object

**Example:**
```javascript
Cart.removeItem(453489216, function(cart) {
  console.log("Item removed! Cart now has " + cart.item_count + " items");
});
```

---

### Cart.updateFromForm(form_id, callback)

Submits a form to add, update, or remove cart items.

**Parameters:**
- `form_id` (string): The ID attribute of the form element
- `callback` (function): Called after form submission, receives updated cart

**Example:**
```html
<form id="add-to-cart-form">
  <input type="hidden" name="product_id" value="112971528">
  <select name="option_id">
    <option value="453489216">Small</option>
    <option value="453489219">Medium</option>
  </select>
  <input type="number" name="quantity" value="1">
  <button type="submit">Add to Cart</button>
</form>

<script>
document.getElementById('add-to-cart-form').addEventListener('submit', function(e) {
  e.preventDefault();

  Cart.updateFromForm('add-to-cart-form', function(cart) {
    alert('Added to cart! You now have ' + cart.item_count + ' items');
  });
});
</script>
```

---

## Format Methods

### Format.money(number, with_delimiter, with_sign, with_code)

Converts numbers to currency format based on store settings.

**Parameters:**
- `number` (number): The amount to format
- `with_delimiter` (boolean): Add thousand separators (default: true)
- `with_sign` (boolean): Include currency symbol (default: true)
- `with_code` (boolean): Include currency code like "EUR" (default: false)

**Examples:**
```javascript
// Format with all defaults (based on store currency)
Format.money(2999);
// Returns: "29.99 €" or "$29.99" depending on store settings

// Format without delimiter
Format.money(1000000, false);
// Returns: "10000.00 €"

// Format without currency sign
Format.money(29.99, true, false);
// Returns: "29.99"

// Format with currency code
Format.money(29.99, true, true, true);
// Returns: "29.99 € EUR"
```

---

### Format.pluralize(count, singular, plural)

Returns appropriate singular or plural form based on count.

**Parameters:**
- `count` (number): The number to check
- `singular` (string): Word to use when count is 1
- `plural` (string): Word to use when count is not 1

**Examples:**
```javascript
Format.pluralize(1, 'product', 'products');
// Returns: "product"

Format.pluralize(5, 'product', 'products');
// Returns: "products"

Format.pluralize(0, 'item', 'items');
// Returns: "items"

// Usage in template
var count = products.length;
console.log("You have " + count + " " + Format.pluralize(count, 'product', 'products'));
// Output: "You have 12 products"
```

---

### Format.queryString(params)

Converts an object into URL-encoded query parameters.

**Parameters:**
- `params` (object): Key-value pairs to convert

**Examples:**
```javascript
Format.queryString({ page: 2, limit: 10 });
// Returns: "page=2&limit=10"

Format.queryString({ search: 'noir casquette', category: 'hats' });
// Returns: "search=noir%20casquette&category=hats"

// Usage with links
var baseUrl = '/products';
var params = { category: 'tees', page: 2 };
var fullUrl = baseUrl + '?' + Format.queryString(params);
// fullUrl: "/products?category=tees&page=2"
```

---

## Common Use Cases

### Display All Products on Homepage

```javascript
Product.findAll({}, function(products) {
  var container = document.getElementById('products-grid');

  products.forEach(function(product) {
    var html = '<div class="product">';
    html += '<img src="' + Product.findImage(product.images[0].url, 'medium') + '">';
    html += '<h3>' + product.name + '</h3>';
    html += '<p>' + Format.money(product.price) + '</p>';
    html += '</div>';

    container.innerHTML += html;
  });
});
```

### Add to Cart with Feedback

```javascript
function addToCart(optionId, quantity) {
  Cart.addItem(optionId, quantity, function(cart) {
    // Update cart count in header
    document.querySelector('.cart-count').textContent = cart.item_count;

    // Show confirmation message
    alert('Added to cart! Total: ' + Format.money(cart.total));
  });
}
```

### Search Products

```javascript
var searchInput = document.getElementById('search-input');
var searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', function() {
  var term = searchInput.value;

  Product.search(term, {}, function(products) {
    console.log('Found ' + products.length + ' ' +
                Format.pluralize(products.length, 'product', 'products'));

    // Display results
    displayProducts(products);
  });
});
```

### Category Filter

```javascript
function loadCategory(categoryPermalink) {
  Product.findAll({ category: categoryPermalink }, function(products) {
    var message = 'Found ' + products.length + ' ' +
                  Format.pluralize(products.length, 'product', 'products') +
                  ' in this category';
    console.log(message);

    displayProducts(products);
  });
}
```

---

## Important Notes

1. **Availability**: The JavaScript API only works within BigCartel store environments (not in external sites)

2. **Async Nature**: All methods are asynchronous and use callbacks - always handle data within the callback function

3. **Error Handling**: Add error handling in your callbacks:
```javascript
Product.findAll({}, function(products) {
  if (!products || products.length === 0) {
    console.log('No products found');
    return;
  }
  // Process products
});
```

4. **Performance**: Use pagination and limits to avoid loading too much data at once:
```javascript
Product.findAll({ limit: 12, page: 1 }, callback);
```

5. **Image Optimization**: Always use `Product.findImage()` to get optimized image sizes instead of using original URLs

6. **Currency**: Use `Format.money()` to ensure prices display correctly according to store currency settings

---

## Related Resources

- [BigCartel Theme API Documentation](https://developers.bigcartel.com/api/themes)
- [Liquid Template Reference](https://developers.bigcartel.com/themes/template-language)
- [Product Object Reference](https://developers.bigcartel.com/api/themes#product)
- [Cart Object Reference](https://developers.bigcartel.com/api/themes#cart)

---

**Last Updated:** 2025-10-19
**Source:** https://developers.bigcartel.com/api/themes#javascript-api
