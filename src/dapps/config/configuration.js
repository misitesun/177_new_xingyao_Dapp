/*
    这里是配置文件，可以配置不同的币种，
    根据前台初始化：this.$dapp.erc20.init('USDT')，传入不同的币种名称，分别进行初始化操作
    abi和api文件，是对应关系，
*/
import Web3Init from "../web3-init.js";

const isLocalChain = process.env.VUE_APP_CHAIN_ID === '31337';
const isBscMainnet = process.env.VUE_APP_CHAIN_ID === '56';

export default {
    async erc20Init(name) {
        let instance = null;
        let address = ''
        if (name == 'USDT' || name == '') {
            address = process.env.VUE_APP_USDT_ADDRESS
        }else if(name == 'STAR') {
            address = process.env.VUE_APP_STAR_ADDRESS
        }else if(name == 'SHINE') {
            address = process.env.VUE_APP_SHINE_ADDRESS
        }else if(name == 'SOL') {
            address = process.env.VUE_APP_SOL_ADDRESS
        }
        instance = new Web3Init({
            artifact: null,
            address: address,
            abi: isBscMainnet
                ? require('../abi/bsc/ERC20.json')
                : require('../abi/ERC20.json')
        });
        let obj = await instance.init();
        return obj;
    },
    async projectInit() {
        let instance = null;
        instance = new Web3Init({
            artifact: null,
            address: process.env.VUE_APP_PROJECT_ADDRESS,
            abi: isLocalChain
                ? require('../abi/localhost/StarShineProject.json')
                : require('../abi/Project.json')
        });
        let obj = await instance.init();
        return obj;
    },
    async routerInit() {
        let instance = null;
        instance = new Web3Init({
            artifact: null,
            address: process.env.VUE_APP_ROUTER_ADDRESS,
            abi: isLocalChain
                ? require('../abi/localhost/PancakeV2Router.json')
                : require('../abi/UniswapV2Router.json')
        });
        let obj = await instance.init();
        return obj;
    },
}
