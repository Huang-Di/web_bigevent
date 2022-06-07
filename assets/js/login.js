$(function() {
    $('#link_reg').on('click', function() {
       $('.login_box').hide()
       $('.reg_box').show()
    })

    $('#link_login').on('click', function() {
        $('.reg_box').hide()
        $('.login_box').show()
    })

    // 从layui中获取form对象
    let form = layui.form
    let layer = layui.layer
    // 通过form.verify()函数自定义晓燕规则
    form.verify({
        // 自定义规则
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否相同
        repwd: function(value) {
         let pwd = $('#password').val()
         if(pwd !== value) {
             return '两次密码不一致'
         }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        let data = {username:$('#form_reg [name=username]').val(), password:$('#form_reg [name=password]').val()}
        $.post('/api/reguser', data,
        function(res) {
            if(res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message)
            }
            layer.msg('注册成功,请登录');
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
       e.preventDefault()
       $.ajax({
           url: '/api/login',
           method: 'POST',
        //    快速获取表单中的数据
           data: $(this).serialize(),
           success: function(res) {
               if(res.status !== 0) {
                   return layer.msg('登录失败')
               }
               layer.msg('登录成功')
            //    将登录成功之后token字符串存储到本地存储localStorag里边
            localStorage.setItem('token', res.token)
           
            //    跳转到后台主页
                location.href = './index.html'
           }
       })
    })
})