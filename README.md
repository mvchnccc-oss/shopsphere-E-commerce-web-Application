# ShopSphere E-Commerce Features

This document lists all the features available in the ShopSphere E-Commerce web application, based on the actions defined in the codebase.

## Database ERD

![database erd][./docs/ERD.png]

## Backend API

![backend API][./docs/Swagger.png]

## Frontend Actions

### Authentication Features

- User Registration (`registerAction`)
- User Login (handled via NextAuth)
- Profile Update (`updateProfileAction`)
- Become a Seller (`becomeSellerAction`)

### Product Management Features

- Get All Products (Paginated) (`getAllProducts`)
- Get Product by ID (`getProductById`)
- Get Products by Category (`getProductsByCategory`)
- Search Products (`searchProducts`)
- Create Product (Seller) (`createProductAction`)
- Update Product (Seller) (`updateProductAction`)
- Delete Product (Seller) (`deleteProductAction`)

### Category Features

- Get All Categories (`getAllCategories`)
- Get Paginated Categories (`getPaginatedCategories`)
- Get Category by ID (`getCategoryById`)

### Cart Features

- Get Cart Items (`getCartAction`)
- Update Cart Item Quantity (`updateCartItemAction`)
- Clear Cart (`clearCartAction`)

### Wishlist Features

- Get Wishlist (`getWishlistAction`)
- Add to Wishlist (`addToWishlistAction`)
- Remove from Wishlist (`removeFromWishlistAction`)

### Order Features

- Get User Orders (`getOrdersAction`)
- Place Order (`placeOrderAction`)

### Admin Features

- Get Admin Statistics (`getAdminStatsAction`)
- Get Admin Users (`getAdminUsersAction`)
- Delete Admin User (`deleteAdminUserAction`)
- Get Admin Products (`getAdminProductsAction`)
- Delete Admin Product (`deleteAdminProductAction`)
- Get Admin Orders (`getAdminOrdersAction`)

### Seller Features

- Get Seller Products (`getSellerProductsAction`)
- Get Seller Orders (`getSellerOrdersAction`)

These features cover the core functionalities of the e-commerce platform, including user management, product browsing, shopping cart, wishlist, ordering, and administrative controls.
