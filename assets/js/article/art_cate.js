$(function() {
  let layer = layui.layer
  let form = layui.form

    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
            let htmlStr = template('tpl_table', res)
            $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    let indexAdd = null
    $('#btncate').on('click', function() {
        indexAdd = layer.open({
            area: ['500px','250px'],
            type: 1,
            title: '添加文章分类',
            content: $('#dialog_add').html()
          })     
    })

    // 通过代理的方式为表单元素绑定提交事件
   $('body').on('submit', '#form_id', function(e) {
       e.preventDefault()
       $.ajax({
           method: 'POST',
           url: '/my/article/addcates',
           data: $(this).serialize(),
           success: function(res) {
               if(res.status !== 0) {
                   return layer.msg('新增分类失败')
               }
               initArtCateList()
               layer.msg('新增分类成功')
            //    根据索引关闭对应的弹出层
              layer.close(indexAdd)
           }
       })
   })


//    通过代理的方式为表单元素绑定点击事件
      let indexExit = null
  $('tbody').on('click', '#btn_bianji', function() {
    //   添加弹出层
      indexExit = layer.open({
        area: ['500px','250px'],
        type: 1,
        title: '修改文章分类',
        content: $('#dialog_exit').html()
      }) 
      
      let id = $(this).attr('data-id')
    //   发起请求获取相应分类的数据
    $.ajax({
        method: 'GET',
        url: '/my/article/cates/' + id,
        success: function(res) {
            form.val('form_exit', res.data)
        }
    })
  })

//   通过代理的方式为修改表单元素绑定提交事件
 $('body').on('submit', '#form_exit', function(e) {
     e.preventDefault()
     $.ajax({
         method:'POST',
         url: '/my/article/updatecate',
         data: $(this).serialize(),
         success: function(res) {
             if(res.status !== 0) {
                 return layer.msg('修改失败！')
             }
             layer.msg('修改成功！')
             layer.close(indexExit)
             initArtCateList()
         }
     })
 })

//  通过代理的方式为删除绑定点击事件
$('tbody').on('click', '#delete', function() {
     let id = $(this).attr('data-id')
    //  提示框用户是否要删除
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
        $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('删除失败')
                }
                layer.msg('删除成功')
                layer.close(index)
                initArtCateList()
            }
        })
        
       
      });
})
})