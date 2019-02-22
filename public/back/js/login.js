$(function(){
//     1. 进行表单校验配置
//    *    校验要求:
//    *        (1) 用户名不能为空, 长度为2-6位
//    *        (2) 密码不能为空, 长度为6-12位

console.log($('#form'));


//使用表单校验插件
$('#form').bootstrapValidator({
   
  
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在6到30之间'
          },
          //callback 专门用来配置回调函数
          callback:{
            message:'用户名错误'
          }
          

          }
         
        },
    
      //密码;
      password:{
        validators: {
          //不能为空
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '用户名长度必须在6到30之间'
          },
          callback:{
            message:'密码错误'
          }
         
        }
      },
    }
  });
  


   /* 
    2. 使用 submit 按钮, 会进行表单提交, 此时表单校验插件会立刻进行校验
       (1) 校验成功, 此时会默认提交, 发生页面跳转,  注册表单校验成功事件, 在事件中阻止默认的跳转提交, 通过ajax提交
       (2) 校验失败, 自动拦截提交

      注册表单校验成功事件, 在事件中阻止默认的提交, 通过ajax提交
  */
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
        type: 'post',
        // 本质上会自动拼接上前面的域名端口  http://localhost:3000/employee/employeeLogin
        url: '/employee/employeeLogin', 
        // 表单序列化, 自动将所有配置了 name 属性的 input 值进行拼接, 用于提交  
        data: $('#form').serialize(),
        dataType: 'json',
        success: function( info ) {
          console.log( info );
        // updateStatus 更新;
        // $('#form').data('booostrapValidator')
          if (info.error === 1000) {
             //调用插件实例方法;更新状态
               // 调用插件实例方法, 更新username字段状态成失败状态
          // updateStatus( field, status, validator );
          // 参数1: 需要更新的字段名称
          // 参数2: 需要更新成的状态  VALID 成功  INVALID 失败
          // 参数3: 配置校验规则, 将来会用配置的规则的 message 进行提示
             $('#form').data("bootstrapValidator").updateStatus('username','INVALID','callback')
            // alert('用户名不存在');

          }
           
             if (info.error === 1001) {
              $('#form').data("bootstrapValidator").updateStatus('password','INVALID','callback')
            // alert('密码错误');
          }
          if (info.success) {
            // 登录成功, 跳转首页
            location.href = 'index.html';
          }
        }
      })
});

  //点击充值按钮的时候,还需要充值表单的错误信息,
  $("[type = 'reset']").on('click',function(){
        

    //重置表单样式;状态重置;
    //reset 本身就可以重置内容;
    // resetForm(false) //只重置状态(默认)
    // resetForm(true) 重置状态和内容
    $('form').data('bootstrapValidator').resetForm();
  })

});