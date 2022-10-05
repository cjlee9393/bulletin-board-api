/* Replace with your SQL commands */
CREATE TABLE writerCommentDocument (
	wid INTEGER REFERENCES writer(wid) ON DELETE CASCADE,
	cid INTEGER REFERENCES comment(cid) ON DELETE CASCADE,
	did INTEGER REFERENCES document(did) ON DELETE CASCADE
);