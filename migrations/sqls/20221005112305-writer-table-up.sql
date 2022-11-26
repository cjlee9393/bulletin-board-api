/* Replace with your SQL commands */
CREATE TABLE writer (
	wid SERIAL PRIMARY KEY,
	username VARCHAR(20) UNIQUE,
	password text NOT NULL,
	point INTEGER DEFAULT 0 CHECK(point>=0)
);