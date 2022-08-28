# XYZ Microservice Health Check API

This API should be used to check if it is running. The API will return an array with one object that has `date` field with value of current time on the machine where the service is running in UTC time zone.

### Query

```
query {
  xyzMicroserviceHealth {
    code
    errors {
      name
      messages
    }
    data {
      date
      version
    }
  }
}
```

### Params

The API does not have any input parameters
