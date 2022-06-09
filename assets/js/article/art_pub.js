$(function () {
    let layer = layui.layer
    let form = layui.form
    initCate()
    initEditor()
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                //    调用模板引擎,渲染分类下拉菜单
                let htmlStr = template('tpl_cate', res)
                $('[name=cat_id]').html(htmlStr)
                //   一定要去调用render去渲染
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //   为选择封面的按钮绑定点击事件
    $('#btn_image').on('click', function () {
        $('#coverFile').click()
    })

    // 监听用户选择的事件
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        let files = e.target.files
        if (files.length === 0) {
            return
        }
        //    根据文件，创建对应的url地址
        let newImgURL = URL.createObjectURL(files[0])
        //    为裁剪区重新设置
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    let atr_state = '已发布'

    // 为存为草稿绑定点击事件
    $('#btn_two').on('click', function () {
        atr_state = '草稿'
    })

    // 为表单绑定提交事件
    $('#form_pub').on('submit', function (e) {
        e.preventDefault()
        // 基于表单快速创建FormData对象
        let fd = new FormData($(this)[0])
        // 将文章的发布状态追加到fd中
        fd.append('state', atr_state)
        //    将封面裁剪过后的图片输出位一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到fd中
                fd.append('cover_img', blob)
                // 发起ajax数据请求
                publishArticle(fd)
            })
    })

//    定义一个发布文章的方法
      function publishArticle(fd) {
          $.ajax({
              method: 'POST',
              url: '/my/article/add',
              data: fd,
            //   如果向服务器提交的是formdata的数据 
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                // 跳转到文章列表页面
                location.href = './article/art_list.html'
            }
          })
      }
})