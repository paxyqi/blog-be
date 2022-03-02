## Description

个人博客后端部分，使用 nestjs 框架搭建，数据库选择 mongoDB 用于文档存储。

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
*注意：需要先启动数据库，连接的数据库ip位于app.module.ts*

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 系统技术选型及目的

### 用户 password 加密存储

为了避免数据库泄露导致的用户名+密码组合的泄密（读者可以尝试用 firefox 提供的信息泄露检测自查一下，优酷曾经有一次较大范围的泄密），需要将密码进行加密再存储，于此同时存储随机生成的密码盐用于后续登录验证，加密函数文件详见/src/utils/cryptogram.ts。

### JWT

JWT(JSON Web Token)是为了在网络应用环境见传递声明而执行的一种基于 JSON 的开放标准，由于其 token 的设计紧凑安全，因此适用于分布式站点的单点登录场景。但 JWT 本身包含了认证信息，一旦泄露则任何人都将获得该令牌的权限，因此应将 JWT 的有效期设置的较短并对重要数据启动二次验证。注意，本项目为保护用户信息，token 信息为用户名+角色，并不添加密码以免被获取后破解。用于验证 Token 的是 Guard(守卫)，直接引用 nest/password 自带的 AuthGuard 即可。  
**注意:** JWT 无法解决后登录用户挤掉先登录用户(同一 user)的问题，后续将为此引进 Redis。

JWT 验证策略文件: src/auth/jwt.strategy.ts。  
校验用户登录信息以及处理 JWT 签证文件: src/auth/auth.service.ts。  
用户登录接口文件: src/user/user.controller.ts。

### 日志收集

引入 log4js 进行日记收集，完善配置文件并进行实例化。
log4js 实例化文件:src/utils/log4js.ts

### 中间件

在用户请求接口的时候，需要记录请求的路由、ip、参数等信息，因此借助中间件来完成，解析 ip 等需要引入 express。  
中间件函数的任务有：

> 1. 执行任何代码
> 2. 对请求和响应对象进行更改
> 3. 结束请求-响应周期
> 4. 调用堆栈中的下一个中间件函数
> 5. 若当前中间件函数没有**结束请求** 或**响应周期** ，他必须调用一个`next()`将控制传递给下一个中间件函数。否则，请求将被挂起。

logger 文件: src/middleware/logger.middleware.ts。

### 简易拦截器

middleware 解决了入参的问题(即将请求信息写入 log 文件)，但定位 bug 则是要依靠出参。  
引入 nest 自带的`Interceptors`(拦截器): src/interceptor/transform.interceptor.ts。
在 main.ts 中引入，使用`useGlobalInterceptors()`调用全局拦截器，此时出参也将打印在日志中。

### 异常处理&过滤器

若在后端不进行更详细的异常处理，若发送的数据有误，前端将收到代码为 500 的报错，前端工程师无法定位问题原因。因此引入 nest 自带的过滤器: src/filter/http-expection.filter.ts。在此文件 catch 并组装成有具体 statusCode、error 以及 msg 的响应再返回给前端即可。

> 此处的 msg 设置的很简单，若 code>=500 则是后端的锅，反之是前端的锅(●'◡'●)

## 数据库选择与目的

在中国的 CS 专业课程中，一定有一门叫做*数据库*的必修课。在这门课以及这门课对应的设计课结束之后，我的脑海里牢牢记住的有三点：ER 图、ACID 原则和 sql 语句。以上三点可以说都是为关系型数据库服务的，而非关系型数据库则只是一笔带过说有 NoSQL 这个东西。那么博客系统是否需要*新潮的*非关系型数据库呢？

> **CAP 定理** 指出对于一个分布式计算系统来说不能同时满足这三点：  
> · **Consistency**一致性：所有节点在同一时间具有相同的数据  
> · **Availability**可用性：每个 req 不管成功/失败，均有 res  
> · **Partition tolerance**分割容忍：系统中任意信息的丢失或失败不会影响系统的继续运作  
> 因此 NoSQL 数据库分为了三大类：  
> · CA - 单点集群，满足一致性，可用性的系统，通常在可扩展性上不太强大。  
> · CP - 满足一致性，分区容忍必的系统，通常性能不是特别高。  
> · AP - 满足可用性，分区容忍性的系统，通常可能对一致性要求低一些。

非关系型数据库并非 ACID 原则的拥趸，但也带来了其他的好处。以本系统选择的 MongoDB 为例，他属于文档存储，以类似 JSON 的格式存储，存储的内容是文档型的，_对应于关系型数据库一行的信息即为一个文档_，他同时兼顾了关系型数据库的特点，可以对某些字段建立 index。  
**MongoDB**将数据存储为一个文档，数据结构由键值对组成。

### 为什么选择 MongoDB？

MongoDB 的数据模型是面向对象的，因此可以表示丰富的、有层级的数据结构；比如博客系统中我需要将**评论和评论的评论（注意有从属关系）**直接展示在**博文**下方，如果采用 MySQL 则需要创建三张表来描述这样的关系。
