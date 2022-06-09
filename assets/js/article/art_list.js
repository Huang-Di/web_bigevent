$(function() {

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;
    // // 定义美化时间过滤器
    //  template.default.imports.dataFormat = function(date) {
    //   let dt = new Date(date)
    //   let newDate = dt.toDateString()
    //   return newDate 
    //  }




    // 定义一个查询的参数的对象，将来请求数据的时候
    // 需要将请求的参数对象提交到服务器
    let q = {
        pagenum: 1,    //页码值
        pagesize: 2,   //每页显示多少条数据
        cate_id : '',  //文章分类的 Id
        state: ''      //文章的状态
    }

    intiTable()
    initCate()

    // 获取文章列表数据的方法 
    // 
    function intiTable() {
      $.ajax({
          method: 'GET',
          url: '/my/article/list',
          data: q,
          success: function(res) {
              if(res.status !== 0) {
                  return layer.msg('获取文章列表失败')
              }
           console.log(res);
           let htmlStr = template('tpl_list', res)
           $('tbody').html(htmlStr)
           renderPage(res.total)
          }
      })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                // 渲染模板引擎到页面
                let htmlStr = template('tpl_cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 通过layui.form渲染表单区域的ui结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定提交事件
    $('#form_search').on('submit', function(e) {
        e.preventDefault()
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询参数对象q中对象的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的帅选条件，重新渲染表格的数据
        intiTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法渲染分页的结构
        laypage.render({
            elem: 'pagebox',  //分页容器的id
            count:total,        //总数据的条数
            limit: q.pagesize,   //每一页显示几条数据
            curr: q.pagenum,      //设置默认被选中的分页
            layout:['count', 'limit', 'prev', 'page', 'next', 'skip',],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发jump回调
            jump: function(obj, first) {
                console.log(first);
                //  console.log(obj.curr);
                // 把最新的页码之，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数,赋值到q查询参数对象中
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表，并渲染表格
                //intiTable()
                if(!first) {
                    intiTable()
                }
            }
        })
    }

    // 通过代理的方式给删除按钮绑定点击事件
    $('tbody').on('click', '#btn_delete', function() {
        // 获取文章的id
        let id = $(this).attr('data-id')
        // 询问用户是否删除数据
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
           $.ajax({
               method: 'GET',
               url: '/my/article/delete/' + id,
               success: function(res) {
                   if(res.status !== 0) {
                       return layer.msg('删除失败')
                   }
                   layer.msg('删除成功')
                   intiTable()
               }
           })
            
            layer.close(index);
          });
    })
})