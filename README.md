# hello-world

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### 本地合约联调

开发环境使用星耀项目的 `starshine-local-31337` 部署。合约地址在 `.env.development` 中配置，Project 地址对应 `StarShineProject` 代理。Project 和 Pancake V2 Router 的本地 ABI 在 `src/dapps/abi/localhost/`，代币操作共用 `ERC20.json`。

启动前端后，打开终端显示的本地地址下的 `/h5/`。登录前，在钱包中手动切换到部署了这批合约的网络，链 ID 为 `31337`。RPC 地址使用部署方提供的节点地址。后端 `VUE_APP_BASE_API` 也需要指向使用同一批合约的测试服务，以便生成对应的交易签名。

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
