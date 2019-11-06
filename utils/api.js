/**
 * 封装api请求
 */
import {
  http
} from 'http.js'

var url = {
  userLogin: "/user/login",
  getUserPhone: "/user/phone",
  userCardReceive: "/card/receive", 
  wxLogin:"/wxlogin",  //用户登录
  wxUserInfo:"/wxUserInfo",  //第一次登录或重新执行登录逻辑
  TopGoodsListQuery:"/ddk/TopGoodsListQuery"  //获取爆款接口
}
module.exports = {
  userLogin(code) {
    return http({
      url: url.userLogin,
      data: {
        code: code
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  },
  getUserPhone(params) {
    return http({
      url: url.getUserPhone,
      data: params
    })
  },
  userCardReceive() {
    return http({
      url: url.userCardReceive,
      method: "GET"
    })
  },
  wxLogin(params){ //用户登录操作
    return http({
      url: url.wxLogin,
      data: params
    })
  },
  WxUserInfo(params) { //用户登录操作
    return http({
      url: url.wxUserInfo,
      data: params
    })
  },


  TopGoodsListQuery(params){  //热销商品查询
    return http({
      url: url.TopGoodsListQuery,
      method:params.method,
      data: params
    })
  },

  GetGoodsDetail(params){  //获取商品详情
    return http({
      url: url.TopGoodsListQuery,
      method: params.method,
      data: params
    })
  }

}