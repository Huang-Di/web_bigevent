$(function() {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function(value) {
            if(value.length > 6) {
                return '昵称必须在1~6字符之间'
            }
        }
    })
    initUserInfo()
//   获取用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('请求失败')
                }
                console.log(res);
                // 调用layui的form.val()快速给表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单数据
    $('#btn').on('click', function(e) {
           e.preventDefault()
           initUserInfo()
    })

    // 监听表单事件
   $('.layui-form').on('submit', function(e) {
       e.preventDefault()
       $.ajax({
           method: 'POST',
           url: '/my/userinfo',
           data: $(this).serialize(),
           success: function(res) {
               if(res.status !== 0) {
                   return layer.msg('更新失败')
               }
               layer.msg('更新用户信息成功')
            //    调用父页面中的方法，重新渲染头像和用户信息
            window.parent.getUserInfo()
           }
       })
   })
})