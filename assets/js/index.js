$(function() {
    getUserInfo()
     let layer = layui.layer
    $('#btn_loginout').on('click', function() {
        layer.confirm('确定退出登录?不在爱我了么?', {icon: 3, title:'呜呜呜'}, function(index){
            //do something
            // 点了退出清空本地存储token 
             localStorage.removeItem('token')
            //  重新跳转到登录页面
            location.href = './login.html'
            layer.close(index);
          });
    })
}) 
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token')||''
        // },
        success: function(res) {
               if(res.status !== 0) {
                   return layui.layer.msg('获取用户信息失败！')
               }
            //    调用渲染用户的头像
              rederAvatar(res.data) 
        },
        // 不论成功还是失败，最终都会调用complete回调函数
        // complete: function(res) {
        // //    在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据进行判断
        // //    console.log(res);
        //    if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //     //  强制清空 token
        //     localStorage.removeItem('token')
        //     // 强制跳转登录页面
        //     location.href = './login.html'
        //    }
        // }
    })
}

// 渲染用户的头像
function rederAvatar(user) {
    // 获取用户的名称
    let name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    // 渲染用户头像
    if(user.user_pic !== null) {
        // 渲染图片头像
     $('.layui-nav-img')
     .attr('src', user.user_pic)
     .show()
     $('.text-avatar').hide()
    } else {
    //    渲染文本头像
    $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}