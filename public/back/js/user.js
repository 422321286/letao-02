//异步请求
$(function(){
     // 1. 一进入页面, 应该发送 ajax 请求, 获取数据, 动态渲染 (模板引擎)
  // template(模板id, 数据对象)  返回一个 htmlStr
  var currentPage = 1;//当前页
  var pageSize = 5; //每页条数;
  var currentId;  // 标记当前正在编辑的用户 id
  var isDelete;  // 标记修改用户成什么状态

  //开始就渲染一次
  render();
  function render() {
      
    $.ajax({

        type:'get',
        url:'/user/queryUser',
        dataType:'json',
        data:{
            page:currentPage,
            pageSize:pageSize
        },
        success:function( info ){
            console.log(info);
            var htmlstr = template('tpl',info);
            $('tbody').html(htmlstr);
           
           // 根据请求回来的数据, 完成分页的初始化显示
        $('#paginator').bootstrapPaginator({
            // 版本号
            bootstrapMajorVersion: 3,
            // 当前页
            currentPage: info.page,
            // 总页数
            totalPages: Math.ceil(info.total / info.size),
            // 给页码添加点击事件
            //前面的三个参数都没用,恩, 最后一个参数为当前页数
            onPageClicked: function (a, b, c, page) {
              console.log(page);
              // 更新 currentPage, 并且重新渲染即可
              currentPage = page;
              render();
            }
          })
        }

    })
  }
   

  //点击改变状态;
   // 2. 点击表格中的按钮, 显示模态框
  // 事件委托的作用:
  // 1. 给动态创建的元素绑定点击事件
  // 2. 批量绑定点击事件 (效率比较高的)
  // 思路: 使用事件委托绑定按钮点击事件

  $('tbody').on('click', '.btn', function() {

    // 显示模态框
    $('#userModal').modal('show');

    // 获取 id
    currentId = $(this).parent().data('id');

    // 获取启用禁用状态
    // 有btn-danger类 => 禁用按钮
    // 禁用按钮 ? 改成禁用状态 0 : 改成启用状态 1
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
  });


  // 给模态框的确定按钮, 添加点击事件
  $('#confirmBtn').click(function() {
    // 发送ajax请求, 完成用户状态的编辑

    // 传参需要两个 id  isDelete
    $.ajax({
      type: 'post',
      url: '/user/updateUser',
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: 'json',
      success: function( info ) {
        console.log( info );
        if (info.success) {
          // 关闭模态框
          $('#userModal').modal('hide');
          // 重新调用 render 完成渲染
          render();
        }
      }
    })
  })

})