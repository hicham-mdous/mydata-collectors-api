# Note API

This API works with notes.

## noteList

Returns a list of notes according to filter parameters and pagination.

### GraphQL

#### Query

```graphql
query CollectorList($params: CollectorFilter, $pagination: PaginationAndSortingInput) {
  collectorList(params: $params, pagination: $pagination) {
    code
    errors {
      name
      messages
    }
    data {
      id
      name
      destinationFilePath
      collectorSourceSystem {
        id
        description
      }
    }
  }
}
```

#### Params

```json
{
  "params": {
    "keyword": "",
  },
  "pagination": {}
}
```

### REST API

#### Entry point

```
GET http://localhost:4101/notes?groupId=00000000-0000-4000-8000-000000000001&keyword=&pageSize=&page=1
```

## noteGet

Returns a note by its id.

### GraphQL

#### Query

```graphql
query NoteGet($id: ID!) {
  noteGet(id: $id) {
    code
    errors {
      name
      messages
    }
    data {
      id
      noteTitle
      noteBody
      createdAt
      updatedAt
      group {
        groupName
      }
    }
  }
}
```

#### Params

```json
{
  "id": "00000000-0000-4000-8000-000000000001"
}
```

### REST API

#### Entry point

```
GET http://localhost:4101/notes/b31cb4d7-6d8f-497c-8c7f-ec985ea7d83d
```

## noteGetMany

Returns multiple notes by their IDs in the requested order. The same ID can be mentioned several times.

### GraphQL

#### Query

```graphql
query NoteGetMany($id: [ID!]) {
  noteGetMany(id: $id) {
    code
    errors {
      name
      messages
    }
    data {
      id
      noteTitle
      noteBody
      createdAt
      updatedAt
      group {
        groupName
      }
    }
  }
}
```

#### Params

```json
{
  "id": ["00000000-0000-4000-8000-000000000001"]
}
```

### REST API

#### Entry point

```
GET http://localhost:4101/notes/7b431bc9-c11b-4d9d-819e-9903bc21f1e5,b31cb4d7-6d8f-497c-8c7f-ec985ea7d83d
```

## noteCreate

Creates a new note.

### GraphQL

#### Query

```graphql
mutation NoteCreate($params: NoteInput) {
  noteCreate(params: $params) {
    code
    errors {
      name
      messages
    }
    data {
      id
      noteTitle
      noteBody
      createdAt
      updatedAt
      group {
        groupName
      }
    }
  }
}
```

#### Params

```json
{
  "params": {
    "groupId": "e2ec7da1-1a67-4e4e-83a6-d2bd8ee19c85",
    "noteTitle": "Second note 3",
    "noteBody": "Some text goes here"
  }
}
```

### REST API

#### Entry point

```
POST http://localhost:4101/notes
```

#### HTTP Body

```json
{
  "params": {
    "groupId": "e2ec7da1-1a67-4e4e-83a6-d2bd8ee19c85",
    "noteTitle": "Second note 3",
    "noteBody": "Some text goes here"
  }
}
```

## noteUpdate

Updates existing note note by its ID.

### GraphQL

#### Query

```graphql
mutation NoteUpdate($id: ID!, $params: NoteInput) {
  noteUpdate(id: $id, params: $params) {
    code
    errors {
      name
      messages
    }
    data {
      id
      noteTitle
      noteBody
      createdAt
      updatedAt
      group {
        groupName
      }
    }
  }
}
```

#### Params

```json
{
  "id": "0b36894e-5fcc-45b5-b6e3-a434040e056d",
  "params": {
    "groupId": "e2ec7da1-1a67-4e4e-83a6-d2bd8ee19c85",
    "noteTitle": "Second note 3",
    "noteBody": "Some text goes here"
  }
}
```

### REST API

#### Entry point

```
PUT http://localhost:4101/notes/0b36894e-5fcc-45b5-b6e3-a434040e056d
```

#### HTTP Body

```json
{
  "params": {
    "groupId": "e2ec7da1-1a67-4e4e-83a6-d2bd8ee19c85",
    "noteTitle": "Second note 3",
    "noteBody": "Some text goes here"
  }
}
```

## noteRemove

Removes existing note by its ID.

### GraphQL

#### Query

```graphql
mutation NoteRemove($id: ID!) {
  noteRemove(id: $id) {
    code
    errors {
      name
      messages
    }
    data {
      id
    }
  }
}
```

#### Params

```json
{
  "id": "0b36894e-5fcc-45b5-b6e3-a434040e056d"
}
```

### REST API

#### Entry point

```
DELETE http://localhost:4101/notes/0b36894e-5fcc-45b5-b6e3-a434040e056d
```

## noteRemoveMany

Removes existing notes by their IDs.

### GraphQL

#### Query

```graphql
mutation NoteRemoveMany($id: [ID!]) {
  noteRemoveMany(id: $id) {
    code
    errors {
      name
      messages
    }
    data {
      id
    }
  }
}
```

#### Params

```json
{
  "id": ["0b36894e-5fcc-45b5-b6e3-a434040e056d"]
}
```

### REST API

#### Entry point

```
DELETE http://localhost:4101/notes/0b36894e-5fcc-45b5-b6e3-a434040e056d,3a36894e-5fcc-45b5-b6e3-a434040e0512
```
