// 每次调用get post ajax的时候会先调用ajaxprefilter这个函数
// 这个函数中 可以呐到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
   
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // console.log(options.url);
    // 统一为有权限的接口。设置headers请求头
    if(options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token')||''
        }
    }
   
    // 全局统一挂载complete回调函数
    options.complete =  function(res) {
        //    在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据进行判断
            console.log(JSON.stringify(res));
            if(res.responseJSON!=null && res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //     //  强制清空 token
             localStorage.removeItem('token')
             // 强制跳转登录页面
             location.href = './login.html'
            }
        }
})