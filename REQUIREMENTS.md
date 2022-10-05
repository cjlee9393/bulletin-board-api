# API Endpoints
#### [token required]: bearer token, see TOKEN_AUTH in *.env* in README.md
## Products
- Index
    - `/products` [GET]
    - Returns the list of products.
- Show
    - `/products/:id` [GET]
    - Returns a product.
- Create [token required]
    - `/products` [POST]
    - Allows you to submit a new product.
    - The request body needs to be in JSON format and include the following properties:
        - name - String - required
        - price - Integer - required
    ```
    POST /products
    Authorization: Bearer <TOKEN_AUTH>

    {
        "name": "french fries",
        "price": 50
    }
    ```

## Users
- Index [token required]
    - `/users` [GET]
    - Returns the list of users.
- Show [token required]
    - `/users/:id` [GET]
    - Returns a user.
- Create [token required]
    - `/users` [POST]
    - Allows you to submit a new user.
    - Returns an authorization token
    - The request body needs to be in JSON format and include the following properties:
        - first_name - String - required
        - last_name - String - required
        - username - String - required
        - password - String - required
    ```
    POST /users
    Authorization: Bearer <TOKEN_AUTH>

    {
        "first_name": "foo",
        "last_name": "bar",
        "username": "foobar",
        "password": "baz"
    }
    ```

## Orders
- Add product to order [token required]
    - `/orders/addProduct` [POST]
    - Allows you to submit a new product and quantity to order.
    - The request body needs to be in JSON format and include the following properties:
        - quantity - Integer - required
        - order_id - Integer - required
        - product_id - Integer - required
    ```
    POST /orders/addProduct
    Authorization: Bearer <TOKEN_AUTH>

    {
        "quantity": "1",
        "order_id": "1",
        "product_id": "1"
    }
    ```

- Current Order by user [token required]
    - `/orders/:id` [GET]
    - Allows you to retrieve current order by user.
    - The path parameter requires user id.

# Data Shapes
## Product
- id
- name
- price

## User
- id
- firstName
- lastName
- username
- password_digest

## Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

# Database Tables and Columns
- products (id SERIAL PRIMARY KEY, name VARCHAR(128), price integer)
- users (id SERIAL PRIMARY KEY, first_name VARCHAR(128), last_name VARCHAR(128), username VARCHAR(128), password_digest text)
- orders (id SERIAL PRIMARY KEY, user_id bigint REFERENCES users(id), order_status status_type)
- order_products (id SERIAL PRIMARY KEY, quantity integer, order_id bigint REFERENCES orders(id), product_id bigint REFERENCES products(id))