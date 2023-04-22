// 1.导入vue 和vuex
import Vue from "vue"
import Vuex from "vuex"
// 导入购物车模块
import moduleCart from "./cart.js"


// 2.将Vuex 安装为 Vue的插件
Vue.use(Vuex)

// 3. 创建store的实例对象
const store = new Vuex.Store({
	// TODO:挂载store模块
	modules:{
		// 2. 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart，例如：购物车模块中 cart 数组的访问路径是 m_cart/cart
		m_cart: moduleCart
	}
})

// 4. 向外共享 Store 的实例对象
export default store