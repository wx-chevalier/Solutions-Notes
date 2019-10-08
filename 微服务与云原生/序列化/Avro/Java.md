# Java

# 序列化基础

使用 JSON 为 Avro 定义 schema。schema 由基本类型（null,boolean, int, long, float, double, bytes 和 string）和复杂类型（record, enum, array, map, union, 和 fixed）组成。例如，以下定义一个 user 的 schema，在 main 目录下创建一个 avro 目录，然后在 avro 目录下新建文件 user.avsc:

```json
{
  "namespace": "lancoo.ecbdc.pre",
  "type": "record",
  "name": "User",
  "fields": [
    { "name": "name", "type": "string" },
    { "name": "favorite_number", "type": ["int", "null"] },
    { "name": "favorite_color", "type": ["string", "null"] }
  ]
}
```

我们可以使用 `java -jar /path/to/avro-tools-1.8.1.jar compile schema <schema file> <destination>` 工具来生成类文件。类文件已经创建好了，接下来，可以使用刚才自动生成的类来创建用户了：

```java
User user1 = new User();
user1.setName("Alyssa");
user1.setFavoriteNumber(256);
// Leave favorite color null

// Alternate constructor
User user2 = new User("Ben", 7, "red");

// Construct via builder
User user3 = User.newBuilder()
             .setName("Charlie")
             .setFavoriteColor("blue")
             .setFavoriteNumber(null)
             .build();
```

把前面创建的用户序列化并存储到磁盘文件：

```java
// Serialize user1, user2 and user3 to disk
DatumWriter<User> userDatumWriter = new SpecificDatumWriter<User>(User.class);
DataFileWriter<User> dataFileWriter = new DataFileWriter<User>(userDatumWriter);
dataFileWriter.create(user1.getSchema(), new File("users.avro"));
dataFileWriter.append(user1);
dataFileWriter.append(user2);
dataFileWriter.append(user3);
dataFileWriter.close();
```

我们是序列化 user 到文件 users.avro，接下来，我们对序列化后的数据进行反序列化：

```java
// Deserialize Users from disk
DatumReader<User> userDatumReader = new SpecificDatumReader<User>(User.class);
DataFileReader<User> dataFileReader = new DataFileReader<User>(new File("users.avro"), userDatumReader);
User user = null;
while (dataFileReader.hasNext()) {
// Reuse user object by passing it to next(). This saves us from
// allocating and garbage collecting many objects for files with
// many items.
user = dataFileReader.next(user);
System.out.println(user);
}
```
