INSERT INTO products (name, price) VALUES ('name', 0);

INSERT INTO users (first_name, last_name, username, password_digest) VALUES ('first_name', 'last_name', 'username', '$2b$10$rQIRS319mFfeu.acDg/kWOg1Drt.vuoP9f4vltSoASdcBf1PQk3Fq');
INSERT INTO users (first_name, last_name, username, password_digest) VALUES ('first_name', 'last_name', 'username', '$2b$10$rQIRS319mFfeu.acDg/kWOg1Drt.vuoP9f4vltSoASdcBf1PQk3Fq');

INSERT INTO orders (user_id, order_status) VALUES (1, 'active');
INSERT INTO orders (user_id, order_status) VALUES (1, 'active');

INSERT INTO order_products (quantity, order_id, product_id) VALUES (0, 1, 1);
INSERT INTO order_products (quantity, order_id, product_id) VALUES (0, 1, 1);