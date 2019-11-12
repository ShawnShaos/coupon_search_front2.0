/**
 * 封装http 请求方法
 */
const apiUrl = "http://localhost:8080"; //服务器api地址
var requestApi;
const http = (params) => {
  //返回promise 对象
  return new Promise((resolve, reject) => {
    requestApi = wx.request({
      url: apiUrl + params.url, //服务器url+参数中携带的接口具体地址
      data: params.data, //请求参数
      header: params.header || {
        "Content-Type": "application/x-www-form-urlencoded", //设置后端需要的常用的格式就好，特殊情况调用的时候单独设置
        "Authorization": wx.getStorageSync('token') || "" //jwt的token
      },
      method: params.method || 'GET', //默认为GET,可以不写，如常用请求格式为POST，可以设置POST为默认请求方式
      // dataType: params.dataType || 'JSON',//返回的数据格式,默认为JSON，特殊格式可以在调用的时候传入参数
      responseType: params.responseType || 'text', //响应的数据类型
      success: function(res) {
        wx.hideLoading(); //统一关闭加载弹窗
        //接口访问正常返回数据
        if (res.statusCode == 200) {
          resolve(res.data)
        } else {
          resolve(res.data)
        }
      },
      fail: function(e) {
        reject(e)
      }
    });
    //获取服务器返回的header信息
    requestApi.onHeadersReceived((res) => {
      wx.setStorageSync('token', res.header.Authorization)  //保存jwt-token信息
    });
  })
}
module.exports = {
  http: http
}