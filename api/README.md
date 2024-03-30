# Commands

## To build and deploy the lambda functions

```
sam build
sam deploy --guided
```

## To sync changes

```
sam sync --stack-name <<NAME>>
```

### Live Sync

```
sam sync --stack-name <<NAME>> --watch
```