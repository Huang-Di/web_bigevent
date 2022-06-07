// 每次调用get post ajax的时候会先调用ajaxprefilter这个函数
// 这个函数中 可以呐到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
   
    options.url = 'http://www.liulongbin.top:3007' + options.url

    console.log(options.url);
})