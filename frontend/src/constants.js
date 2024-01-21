// since we are using proxy in package.json, we can use relative path
export const BASE_URL =
  process.env.NODE_ENV === 'development' ? '' : process.env.SERVER_URL

export const PRODUCTS_URL = '/api/products'
export const USERS_URL = '/api/users'
export const ORDERS_URL = '/api/orders'
export const PAYPAL_URL = '/api/config/paypal';