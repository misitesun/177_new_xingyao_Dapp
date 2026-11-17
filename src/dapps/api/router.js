import DApp from '../config/configuration.js';
import BigNumber from "bignumber.js";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
const API = {
    // 获取可兑换地址（输入的数量，[地址1，地址2]）
	async getAmountsOut(amount,addressList) {
        const amountWei = ethers.utils.parseUnits(amount + '', 18)
		let {
			getAmountsOut
		} = this.meta;
		return new Promise(async (resolve, reject) => {
			getAmountsOut(amountWei,addressList).then(res => {
				resolve(ethers.utils.formatEther(res[1]))
			}).catch(err => {
				reject(err)
			})
		});
	},

    // 兑换(输入的数量，数量2，[地址1，地址2]，自己的钱包地址，过期时间)
	async swapExactTokensForTokensSupportingFeeOnTransferTokens(amount,amountOutMin,path,to,deadline) {
        const amountWei = ethers.utils.parseUnits(amount + '', 18)
        const amountOutMinWei = ethers.utils.parseUnits(amountOutMin + '', 18)
		let {
			swapExactTokensForTokensSupportingFeeOnTransferTokens
		} = this.meta;
		return new Promise(async (resolve, reject) => {
			swapExactTokensForTokensSupportingFeeOnTransferTokens(amountWei,amountOutMinWei,path,to,deadline).then(res => {
				resolve(res)
			}).catch(err => {
				reject(err)
			})
		});
	},


    
}

export default {
	meta: null,
	account: null,
	web3: null,
	async init() {
		let obj = await DApp.routerInit();
		let {
			meta,
			account,
			web3
		} = obj;
		this.meta = meta;
		this.account = account;
		this.web3 = web3;
		return this;
	},
	...API
}