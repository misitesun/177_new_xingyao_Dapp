import DApp from '../config/configuration.js';
import { ethers } from "ethers";

const DEFAULT_GAS_PRICE = ethers.utils.parseUnits('0.05', 'gwei');

function getContractMethod(contract, methodName) {
    const method = contract && contract[methodName];
    if (typeof method !== 'function') {
        throw new Error(`Project ABI does not contain method: ${methodName}`);
    }
    return method;
}

async function getTxOptions(ctx, extraOptions = {}) {
    const nonce = await ctx.web3.getTransactionCount(ctx.account);
    return {
        nonce,
        gasPrice: DEFAULT_GAS_PRICE,
        ...extraOptions,
    };
}

async function readContract(ctx, methodName, args = []) {
    const method = getContractMethod(ctx.meta, methodName);
    return method(...args);
}

async function writeContract(ctx, methodName, args = [], extraOptions = {}) {
    const method = getContractMethod(ctx.meta, methodName);
    const txOptions = await getTxOptions(ctx, extraOptions);
    return method(...args, txOptions);
}

const API = {
    /**
     * 获取 Project 合约中配置的 vSOL 地址。
     */
    async vsol() {
        return readContract(this, 'vsol');
    },

    /**
     * 捐赠/入单。
     *
     * amount、deadline、signature 需要与后端签名参数保持一致，
     * 因此这里不做 parseUnits，直接透传调用方传入的原始值。
     */
    async donate(id, amount, referrer, deadline, signature) {
        return writeContract(this, 'donate', [
            id,
            amount,
            referrer,
            deadline,
            signature,
        ]);
    },

    /**
     * 矿机下单。
     *
     * 新 Project ABI: buyMiner(id, amount, deadline, signature)
     * amount、deadline、signature 均来自后端签名结果，需要原样透传，避免破坏签名校验。
     */
    async buyMiner(id, amount, deadline, signature) {
        return writeContract(this, 'buyMiner', [
            id,
            amount,
            deadline,
            signature,
        ]);
    },

    /**
     * STAR 闪兑 SOL。
     *
     * 新 Project ABI: exchangeStarForSol(id, starAmount, solAmount, shineBps, deadline, signature)
     * starAmount、solAmount、shineBps、deadline、signature 由后端按订单签名返回，前端不重新换算。
     */
    async exchangeStarForSol(id, starAmount, solAmount, shineBps, deadline, signature) {
        return writeContract(this, 'exchangeStarForSol', [
            id,
            starAmount,
            solAmount,
            shineBps,
            deadline,
            signature,
        ]);
    },

    /**
     * 提币。
     *
     * 新 Project ABI: withdrawToken(id, token, amount, deadline, signature)
     * token 为提币资产合约地址，amount/deadline/signature 保持后端返回的原始值。
     */
    async withdrawToken(id, token, amount, deadline, signature) {
        return writeContract(this, 'withdrawToken', [
            id,
            token,
            amount,
            deadline,
            signature,
        ]);
    },



}

export default {
    meta: null,
    account: null,
    web3: null,
    signer: null,
    async init() {
        let obj = await DApp.projectInit();
        let {
            meta,
            account,
            web3,
            signer
        } = obj;
        this.meta = meta;
        this.account = account;
        this.web3 = web3;
        this.signer = signer;
        return this;
    },
    ...API
}
