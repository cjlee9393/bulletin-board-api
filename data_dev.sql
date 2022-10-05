INSERT INTO products (name, price) VALUES ('whopper', 200);
INSERT INTO products (name, price) VALUES ('whopper junior', 100);
INSERT INTO products (name, price) VALUES ('burger', 100);

INSERT INTO users (first_name, last_name, username, password_digest) VALUES ('stu', 'dent', 'student', '$2b$10$rQIRS319mFfeu.acDg/kWOg1Drt.vuoP9f4vltSoASdcBf1PQk3Fq');
INSERT INTO users (first_name, last_name, username, password_digest) VALUES ('instru', 'ctor', 'instructor', '$2b$10$rQIRS319mFfeu.acDg/kWOg1Drt.vuoP9f4vltSoASdcBf1PQk3Fq');
INSERT INTO users (first_name, last_name, username, password_digest) VALUES ('re', 'viewer', 'reviewer', '$2b$10$rQIRS319mFfeu.acDg/kWOg1Drt.vuoP9f4vltSoASdcBf1PQk3Fq');

INSERT INTO orders (user_id, order_status) VALUES (1, 'active');
INSERT INTO orders (user_id, order_status) VALUES (2, 'active');
INSERT INTO orders (user_id, order_status) VALUES (3, 'active');

INSERT INTO order_products (quantity, order_id, product_id) VALUES (1, 1, 1);
INSERT INTO order_products (quantity, order_id, product_id) VALUES (1, 1, 3);
INSERT INTO order_products (quantity, order_id, product_id) VALUES (2, 2, 2);
INSERT INTO order_products (quantity, order_id, product_id) VALUES (1, 2, 3);
INSERT INTO order_products (quantity, order_id, product_id) VALUES (1, 3, 1);
INSERT INTO order_products (quantity, order_id, product_id) VALUES (1, 3, 2);