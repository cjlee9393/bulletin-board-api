/* Replace with your SQL commands */
CREATE TABLE writer (
	wid SERIAL PRIMARY KEY,
	username VARCHAR(20) NOT NULL,
	password VARCHAR(20) NOT NULL,
	point INTEGER DEFAULT 0
);