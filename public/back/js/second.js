$(function () {

  // 1. 一进入页面发送 ajax请求
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页条数
  render(); // 完成渲染

  function render() {
    $.ajax({
      type: 'get',
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function (info) {
        console.log(info)
        var htmlStr = template('secondTpl', info);
        $('tbody').html(htmlStr);

        // 实现分页插件的初始化
        $('#paginator').bootstrapPaginator({
          // 版本号
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: info.page,
          // 总页数
          totalPages: Math.ceil(info.total / info.size),
          // 给页码添加点击事件
          onPageClicked: function (a, b, c, page) {
            // 更新当前页
            currentPage = page;
            // 并且重新渲染
            render();
          }
        })
      }
    })
  }


  // 2. 点击添加分类按钮, 显示添加模态框
  $('#addBtn').click(function () {
    // 显示模态框, 就应该发送请求
    $('#addModal').modal('show');

    // 发送请求, 获取一级分类的全部数据, 将来用于渲染
    // 根据已有接口, 模拟获取全部数据的接口, page:1  pageSize:100
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function (info) {
        console.log(info);
        var htmlStr = template('dropdownTpl', info);
        $('.dropdown-menu').html(htmlStr);
      }
    })

  });


  // 3. 给下拉菜单添加可选功能
  $('.dropdown-menu').on('click', 'a', function () {
    // 获取 a 的文本
    var txt = $(this).text();
    // 设置给 button 按钮
    $('#dropdownText').text(txt);

    //获取id 设置给隐藏域用于提交
    var id = $(this).data('id');
    //设置给隐藏域;
    $('[name="categoryId"]').val(id);
    //校验文本的底层用的是input 事件 所以的更新校验状态成功
    // $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID')
    $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');
  })


  //4. 完成文件上传的初始化;
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data);
      var result = data.result;//后台返回的结果集;
      var picUrl = result.picAddr;//图片的地址
      //将地址设置给img  src 
      $('#imgBox img').attr('src', picUrl);
      //将路径值赋值隐藏域便于提交
      $('[name="brandLogo"]').val(picUrl);
      //隐藏域有值,就是更新状态成功;
      $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
    }
  });

  //5.直接进行校验
  $('#form').bootstrapValidator({
    //配置 excluded 选项 ,对隐藏域进行校验
    excluded: [],

    //  配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //配置检验字段列表
    fields:{
      //选择一级分类
      categoryId:{
        validators:{
          notEmpty:{
            message:'请选择一次分类'
          }
        }
      },
      //输入二级分类
      brandName:{
        validators:{
          notEmpty:{
            message:'请输入二级分类'
          }
        }
      },
      //二级分类图片:
      brandLogo:{
        validators:{
          notEmpty:{
            message:'请选择图片'
          }
        }
      }
    }

  });

  //6.注册表单校验成功实践,阻止默认的提交,通过ajax请求,进行添加数据
  $('#form').on('success.form.bv',function( e ){
         //值默认事件
         e.preventDefault();
console.log(1);

         //请求$;
      $.ajax({
        type:'post',
        url:'/category/addSecondCategory',
        //获取的图片的路径
        data:$('#form').serialize(),
        dataType:'json',
        success:function( info ){
            console.log(info);
            if(info.success){
              // 添加成功 关闭模态框
            $('#addModal').modal('hide');
            //页面重新渲染,第一页;
            currentPage = 1;
            render();
              //将表单重置 (内容和状态)
             $('#form').data('bootstrapValidator').resetForm(true);

             //button 和img  不是表单元素,手动重置;
             $('dropdownText').text('请选择一级分类');
             $('#imgBox img').attr('src','./images/none.png');
            }
        }
      })

  })

})

