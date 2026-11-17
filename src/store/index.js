import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import createPersistedState from 'vuex-persistedstate'; // vuex持久化,
const store = new Vuex.Store({
	state:{
		address:'', // 默认钱包地址
	},
	mutations:{
		setAddress(state,address){
			state.address = address
		}
	},
	actions:{
		initAddress(data,address){
			console.log(address);
			this.commit('setAddress',address)
		}
	},
	plugins: [createPersistedState()], // 持久化：默认将vuex中的值保存到localStorage
})

export default store
