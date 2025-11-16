# Documentation

This folder contains local documentation for the Paris Nord-Est BigCartel theme.

## Contents

### [BIGCARTEL_JS_API.md](./BIGCARTEL_JS_API.md)

Complete reference for the BigCartel JavaScript API, including:

- **Product Methods**: `find`, `findAll`, `search`, `findImage`
- **Cart Methods**: `refresh`, `addItem`, `updateItem`, `removeItem`, `updateFromForm`
- **Format Methods**: `money`, `pluralize`, `queryString`

Each method includes:
- Full parameter descriptions
- Return object structures
- Working examples
- Common use cases

**Quick Examples:**

```javascript
// Get all products
Product.findAll({}, function(products) {
  console.log("Found " + products.length + " products");
});

// Add to cart
Cart.addItem(optionId, quantity, function(cart) {
  console.log("Cart now has " + cart.item_count + " items");
});

// Format price
var formatted = Format.money(29.99);
// Returns: "29.99 €"
```

---

## Development Setup

### Dugway Configuration

The project uses `.dugway.json` to connect to the live BigCartel store during local development:

```json
{
  "store": {
    "subdomain": "parisnordest"
  }
}
```

This configuration provides:
- **Real Products**: Fetched dynamically via BigCartel JavaScript API
- **Custom Pages**: All pages from the live store (lookbook, où nous trouver, etc.)
- **Store Settings**: Production theme configuration

**No manual mocking needed** - all data comes from the live store API.

## External Resources

- [BigCartel Theme API](https://developers.bigcartel.com/api/themes)
- [Liquid Template Reference](https://developers.bigcartel.com/themes/template-language)
- [Dugway Development Tool](https://dugway.bigcartel.com/)

---

**Note:** Documentation is extracted and adapted from official BigCartel developer resources for quick local reference.
