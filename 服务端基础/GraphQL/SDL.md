[![返回目录](https://i.postimg.cc/WzXsh0MX/image.png)](https://parg.co/UdT)

# GraphQL SDL

### 内省查询结果

GraphQL 的 API 是被要求自我注释的，每个 GraphQL API 应可以返回其结构，这就是所谓的内省(Introspection)，往往是 `__schema` 端口的返回结果：

```json
{
  __schema {
    types {
      kind
      name
      possibleTypes {
        name
      }
    }
  }
}
```

我们可以利用 graphql 库提供的 introspectionQuery 查询来进行获取：

```js
const { introspectionQuery } = require('graphql');
...
fetch('https://1jzxrj179.lp.gql.zone/graphql', {
  ...
  body: JSON.stringify({ query: introspectionQuery })
})
...
```

同样的，我们可以将内省的查询结果转化为 GraphQL Schema 对象：

```js
const { buildClientSchema } = require('graphql');
const fs = require('fs');

const introspectionSchemaResult = JSON.parse(fs.readFileSync('result.json'));
const graphqlSchemaObj = buildClientSchema(introspectionSchemaResult);
```
