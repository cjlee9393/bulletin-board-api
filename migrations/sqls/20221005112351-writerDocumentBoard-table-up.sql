/* Replace with your SQL commands */
CREATE TABLE writerDocumentBoard (
	wid INTEGER REFERENCES writer(wid) ON DELETE CASCADE,
	did INTEGER REFERENCES document(did) ON DELETE CASCADE,
	bid INTEGER REFERENCES board(bid) ON DELETE CASCADE
);