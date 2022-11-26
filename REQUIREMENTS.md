# API Endpoints
#### [token required]: bearer token, see TOKEN_AUTH in *.env* in README.md
## Writers
- Index [token required]
    - `/writers` [GET]
    - Returns the list of writers.
- Show [token required]
    - `/writers/:wid` [GET]
    - Returns a writer.
- Create
    - `/writers` [POST]
    - Allows you to submit a new writer.
    - Returns an authorization token
    - The request body needs to be in JSON format and include the following properties:
        - username - String - required
        - password - String - required
    ```
    POST /writers

    {
        "username": "frenchfries",
        "password": "my-password"
    }
    ```
- Authenticate
    - `/authenticate?username=<username>&password=<password>` [GET]
    - Authenticate username and password
    - Returns an authorization token
    
## Boards
- Index [token required]
    - `/boards` [GET]
    - Returns the list of boards.
- Create [token required]
    - `/boards` [POST]
    - Allows you to submit a new board.
    - The request body needs to be in JSON format and include the following properties:
        - boardname - String - required
    ```
    POST /boards
    Authorization: Bearer <TOKEN_AUTH>

    {
        "boardname": "foobar",
    }
    ```

## Documents
- Index [token required]
    - `/documents/:bid` [GET]
    - Returns the list of documents in the board.
- Create [token required]
    - `/documents` [POST]
    - Allows you to submit a new document.
    - The request body needs to be in JSON format and include the following properties:
        - wid - String - writer id, required
        - bid - String - board id, required
        - documentname - String - required
        - content - String - required
    ```
    POST /documents
    Authorization: Bearer <TOKEN_AUTH>

    {
        "wid": "2",
        "bid": "2",
        "documentname": "new documentname",
        "content": "to-be-updated"
    }
    ```
- Delete [token required]
    - `/documents?did=<documentId>` [DELETE]

## Comments
- Index [token required]
    - `/comments/:did` [GET]
    - Returns the list of comments in the document.
- Create [token required]
    - `/comments` [POST]
    - Allows you to submit a new comment.
    - The request body needs to be in JSON format and include the following properties:
        - wid - String - writer id, required
        - did - String - document id, required
        - content - String - required
    ```
    POST /comments
    Authorization: Bearer <TOKEN_AUTH>

    {
        "wid": 2,
        "did": 1,
        "content":"comment-to-be-updated"
    }
    ```
- Delete [token required]
    - `/comments?cid=<commentId>` [DELETE]

## Database tables and columns
- <a href="https://chivalrous-newsprint-a46.notion.site/DB-1fe1022150b14c1f858b22cfd01455d4" title="Database tables and columns">Database implementation</a>
    