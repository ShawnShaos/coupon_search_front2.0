/**
 * 封装api请求
 */
import {
  http
} from 'http.js'

const APPID = "wx32540bd863b27570"

var url = {
  userLogin: "/user/login",
  getUserPhone: "/user/phone",
  userCardReceive: "/card/receive", 
  wxLogin:"/wxlogin",  //用户登录
  wxUserInfo:"/wxUserInfo",  //第一次登录或重新执行登录逻辑
  TopGoodsListQuery:"/ddk/TopGoodsListQuery",  //获取爆款列表接口
  GetGoodsDetail:"/ddk/GetGoodsDetail",  //获取商品详情
  GetProByGid:"/ddk/GetProByGid",  //获取商品推广链接
  GoodsOptGet:"/goods/GoodsOptGet",  //goods商品类目列表
  GoodsOptGetByCustomize:"/goods/GoodsOptGetByCustomize",  //goods商品类目列表(自定义)
  GoodsSearch: "/ddk/GoodsSearch", //根据标题搜索商品

}
module.exports = {
  appId : APPID,
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
      data: params.data
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
      data: params.data
    })
  },
  WxUserInfo(params) { //用户登录操作
    return http({
      url: url.wxUserInfo,
      data: params.data
    })
  },
//---------------pdd-------------------------

  TopGoodsListQuery(params){  //热销商品查询
    return http({
      url: url.TopGoodsListQuery,
      method:params.method,
      data: params.data
    })
  },

  GetGoodsDetail(params){  //获取商品详情
    return http({
      url: url.GetGoodsDetail,
      method: params.method,
      data: params.data
    })
  },

  GetProByGid(params) {  //热销商品查询
    return http({
      url: url.GetProByGid,
      method: params.method,
      data: params.data
    })
  },

  GoodsOptGet(params) {  //goods商品类目列表
    return http({
      url: url.GoodsOptGet,
      data: params.data
    })
  },

  GoodsOptGetByCustomize(params) {  //goods商品类目列表(自定义)
    return http({
      url: url.GoodsOptGetByCustomize,
    })
  },

   GoodsSearch(params) {  //根据标题搜索商品
    return http({
      url: url.GoodsSearch,
      data: params.data
    })
  }
}