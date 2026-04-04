# DUT_Craft_Servers

`DUT_Craft_Servers` 是一个用于展示 `DUT_Craft` Minecraft 服务器状态的静态页面。页面会读取预设服务器列表，并显示每个服务器的在线状态、人数、版本、MOTD 和地址信息。

## 功能简介

- 从 `public/servers.json` 读取服务器列表，适合直接通过仓库维护
- 支持刷新全部服务器，也支持单独刷新某一台服务器
- 展示在线、离线、错误三种状态，以及版本、在线人数、在线玩家列表和服务器图标
- 支持一个服务器配置多个地址，页面中可直接点击复制地址
- 当服务器列表更新后，页面重新刷新时会重新读取最新 JSON

## 本地使用

```bash
npm install
npm run dev
```

构建产物：

```bash
npm run build
```

## 配置服务器列表

服务器列表文件位于 [public/servers.json](/D:/DUT_Craft/Scripts/DUT_Craft_Servers/public/servers.json)。

推荐使用 `address` 数组格式，每个服务器至少提供一个地址：

```json
[
  {
    "name": "DUT_Craft 大厅",
    "address": [
      {
        "host": "lobby.unsafe.top",
        "port": 25565
      }
    ]
  },
  {
    "name": "DUT_Craft 测试服",
    "address": [
      {
        "host": "test.unsafe.top",
        "port": 25565
      },
      {
        "host": "test2.unsafe.top",
        "port": 25566
      }
    ]
  }
]
```

字段说明：

- `name`：页面显示名称
- `address`：服务器地址列表
- `host`：服务器域名或 IP
- `port`：端口，可省略；省略时按默认 `25565` 处理
- `id`：可选，用于区分同一服务器下的多个地址

同时兼容旧格式：

```json
[
  {
    "name": "DUT_Craft 大厅",
    "host": "lobby.unsafe.top",
    "port": 25565
  }
]
```

## 说明

- 页面数据通过 `https://api.mcsrvstat.us/2` 查询
- 接口结果可能存在缓存，页面展示不一定是服务器的瞬时状态
