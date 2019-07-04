[![返回目录](https://i.postimg.cc/WzXsh0MX/image.png)](https://parg.co/UdT)

# GraphQL

> GraphQL is Facebook’s new query language for fetching application data in a uniform way.

GraphQL 并不是一个面向图数据库的查询语言，而是一个数据抽象层，包括数据格式、数据关联、查询方式定义与实现等等一揽子的东西。GraphQL 也并不是一个具体的后端编程框架，如果将 REST 看做适合于简单逻辑的查询标准，那么 GraphQL 可以做一个独立的抽象层，通过对于多个 REST 风格的简单的接口的排列组合提供更多复杂多变的查询方式。与 REST 相比，GraphQL 定义了更严格、可扩展、可维护的数据查询方式。 ![](https://cldup.com/ysnmIMhqRU.png) ![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2017/1/1/fdasfasdfdasfsd.gif)

GraphQL 与之前 Netflix 出品的 Falcor，都是致力于解决相同的问题：如何有效处理日益增长不断变化的 Web/Mobile 端复杂的数据需求。笔者一直认为，REST 原论文最大的功劳在于前后端分离与无状态请求，而 REST 的资源化的请求方式只适合面向简单的请求，对于具有复杂资源间关联的请求就有点无能为力。关于这一点，笔者在之前的[RARF](https://segmentfault.com/a/1190000004600730)系列中有过充分的讨论。

> GraphQL is a specification.

还是需要强调一点，引入 GraphQL 并不意味着要像之前从 Struts 迁移到 SpringBoot 一样需要去修改你的真实的后端代码，因此 GraphQL 可以看做一个业务逻辑层灵活有效地辅助工具。这一点也是 GraphQL 与原来的 REST API 最大的差别，举例而言：

```
{
  latestPost {
    _id,
    title,
    content,
    author {
      name
    },
    comments {
      content,
      author {
        name
      }
    }
  }
}
```

这是一个很典型的 GraphQL 查询，在查询中指明了需要返回某个 Blog 的评论与作者信息，一个典型的返回结果譬如：

```
{
  "data": {
    "latestPost": {
      "_id": "03390abb5570ce03ae524397d215713b",
      "title": "New Feature: Tracking Error Status with Kadira",
      "content": "Here is a common feedback we received from our users ...",
      "author": {
        "name": "Pahan Sarathchandra"
      },
      "comments": [
        {
          "content": "This is a very good blog post",
          "author": {
            "name": "Arunoda Susiripala"
          }
        },
        {
          "content": "Keep up the good work",
          "author": {
            "name": "Kasun Indi"
          }
        }
      ]
    }
  }
}
```

而如果采用 REST API 方式，要么需要前端查询多次，要么需要去添加一个新的接口，专门针对前端这种较为特殊的请求进行响应，而这样又不可避免地导致后端代码的冗余，毕竟很有可能这个特殊的请求与返回哪天就被废了。

```json
{
  user(id:1) {
    name
    title
    avatarUrl
    timezone
    locale
    lastSeenOnline
    email
    phone
    location

    accountOwner {
      name
      avatarUrl
    }

    tags {
      edges {
        node {
          label
          color
        }
      }
    }

    accountUsers(first:10) {
      edges {
        node {
          id
          avatarUrl
        }
      }
      pageInfo {
        totalAccountUsers
      }
    }

    recentConversations(first:10) {
      edges {
        node {
          lastMessage
          updatedAt
          status
        }
        pageInfo {
          totalConversationCount
        }
      }
    }
  }
}
```

![](https://coding.net/u/hoteam/p/Cache/git/raw/master/2016/10/2/1-LidfuCRZipAKpVeRqh1Wjg.png)
