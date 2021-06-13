import {request} from './request';

export function getHomeMultidata() {
  return request({
    url:'/home/multidata'
  })
}

export function getHomeGoods(type,page) {
  return request({
    url:'home/data',
    params:{
      type,
      page
    }
  })
}


//  函数调用 -> 压入函数栈(保存函数调用过程中所有变量)
//  函数调用结束  ->  弹出函数栈(释放函数中所有变量)
//  再次调用再次创建
// function test() {
//   const names = ['why','aaa']
// }
//
// test()

// const totalNums = []
//
// const nums1 = [20, 11, 222]
//
// const nums2 = [20, 11, 222]

// for(let i in num1) {
//   totalNums.push(i)
// }

// totalNums.push(...nums1)