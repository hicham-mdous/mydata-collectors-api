# Group API

This API works with notes groups.

## groupList

Returns a list of notes groups according to filter parameters and pagination

### GraphQL

#### Query

```graphql
query GroupList($params: GroupFilter, $pagination: PaginationAndSortingInput) {
  groupList(params: $params, pagination: $pagination) {
    code
    errors {
      name
      messages
    }
    data {
      id
      groupName
      createdAt
      updatedAt
      notes {
        noteTitle
      }
    }
  }
}
```

#### Params

```json
{
  "params": {
    "keyword": ""
  },
  "pagination": {}
}
```

### REST API

#### Entry Point

```
GET http://localhost:4101/groups?keyword=&pageSize=&page=1
```

## groupGet

Returns a note group by its id.

### GraphQL

#### Query

```graphql
query GroupGet($id: ID!) {
  groupGet(id: $id) {
    code
    errors {
      name
      messages
    }
    data {
      id
      groupName
      createdAt
      updatedAt
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

#### Entry Point

Get a note groupp provide group ID:

```
GET http://localhost:4101/groups/c3faa06f-f932-4603-92ae-7f0b164d9918
```

## groupGetMany

Returns multiple note groups by their IDs in the requested order. The same ID can be mentioned several times.

### GraphQL

#### Query

```graphql
query GroupGetMany($id: [ID!]) {
  groupGetMany(id: $id) {
    code
    errors {
      name
      messages
    }
    data {
      id
      groupName
      createdAt
      updatedAt
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

#### Entry Point

To get multiple note groups provide comma separated list of IDs:

```
GET http://localhost:4101/groups/c3faa06f-f932-4603-92ae-7f0b164d9918,a4faa06f-f932-4603-92ae-7f0b164d0123
```

## groupCreate

Creates a new note group.

### GraphQL

#### Query

```graphql
mutation GroupCreate($params: GroupInput) {
  groupCreate(params: $params) {
    code
    errors {
      name
      messages
    }
    data {
      id
      groupName
      createdAt
      updatedAt
    }
  }
}
```

#### Params

```json
{
  "params": {
    "groupName": "Second Group"
  }
}
```

### REST API

#### Entry point

```
POST http://localhost:4101/groups/
```

HTTP Body:

```json
{
  "params": {
    "groupName": "Second Group"
  }
}
```

## groupUpdate

Updates existing note group by its ID.

### GraphQL

#### Query

```graphql
mutation GroupUpdate($id: ID!, $params: GroupInput) {
  groupUpdate(id: $id, params: $params) {
    code
    errors {
      name
      messages
    }
    data {
      id
      groupName
      createdAt
      updatedAt
    }
  }
}
```

#### Params

```json
{
  "id": "0b36894e-5fcc-45b5-b6e3-a434040e056d",
  "params": {
    "groupName": "Second Group"
  }
}
```

### REST API

#### Entry point

```
PUT http://localhost:4101/groups/c3faa06f-f932-4603-92ae-7f0b164d9918
```

#### HTTP Body

```json
{
  "params": {
    "groupName": "Second Group"
  }
}
```

## groupRemove

Removes existing note group by its ID.

### GraphQL

#### Query

```graphql
mutation GroupRemove($id: ID!) {
  groupRemove(id: $id) {
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
DELETE http://localhost:4101/groups/c3faa06f-f932-4603-92ae-7f0b164d9918
```

## groupRemoveMany

Removes existing note groups by their ID.

### GraphQL

#### Query

```graphql
mutation GroupRemoveMany($id: [ID!]) {
  groupRemoveMany(id: $id) {
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

To delete multiple note groups provide comma separated list of IDs:

```
DELETE http://localhost:4101/groups/c3faa06f-f932-4603-92ae-7f0b164d9918,a0faa06f-f932-4603-92ae-7f0b164d0123
```
