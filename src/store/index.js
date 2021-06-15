import Vue from 'vue'
import Vuex from 'vuex'

//  1.安装插件
Vue.use(Vuex)

//  2.创建Store对象
const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
    addCart(state, payload) {
      // payload新添加的商品
      // let oldProduct = null;
      // for(let item of state.cartList) {
      //   if(item.iid === payload.iid) {
      //     oldProduct = item;
      //   }
      // }

      //  方法三
      let oldProduct = state.cartList.find(item => item.iid === payload.iid)

      //  2.判断oldProduct
      if (oldProduct) {
        oldProduct.count += 1
      } else {
        payload.count = 1
        state.cartList.push(payload)
      }

      //方法二：
      // let index = state.cartList.indexOf(payload)
      // if (index === -1) {
      //   payload.count = 1
      //   state.cartList.push(payload)
      // } else {
      //   state.catrList[index].count += 1;
      // }
    }
  }
})

//  3.挂载Vue实例上
export default store