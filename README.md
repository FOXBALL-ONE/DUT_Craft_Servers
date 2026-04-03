# DUT_Craft_Servers
Servers querying for DUT_Craft

## 本地调试

1. 安装依赖：`npm install`
2. 启动开发：`npm run dev`

## 修改服务器列表（GitHub Pages）

服务器列表已移动到 `public/servers.json`，格式示例：

```json
[
	{ "name": "DUT_Craft大厅", "host": "lobby.unsafe.top" },
	{ "name": "DUT_Craft建筑服", "host": "building.unsafe.top" },
	{ "name": "示例离线服", "host": "herobrine.net", "port": 25565 }
]
```

在 GitHub 网页端直接编辑这个文件并提交后，Pages 完成部署即可生效。
页面每次点击“刷新全部服务器”都会重新读取这个 JSON。
