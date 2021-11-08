import Config from "@common/config";

/**
 * @description API接口路径配置
 */
export default class API extends Config {
  /**
   * @description 用户登录
   */
  static get LOGIN() { return this.API + '/login/login' }
  
  /**
   * @description 用token获取用户信息
   */
  static get GET_USERINFO() { return this.API + '/user/getOneByToken' }

  /**
   * @description 退出登录、登出
   */
  static get LOGOUT() { return this.API + '/logout' }

  /**
   * @description 获取菜单
   */
  static get GET_MEUN() { return this.API + '/permission/selectRoleMenu' }

  /**
   * @description 获取教师列表
   */
  static get GET_TEACHER() { return this.API + '/user/selectTeacherAndAdmin' }

  /**
   * @description 获取角色
   */
   static get GET_ROLE() { return this.API + '/user/selectRole' }

  /**
   * @description 邮箱 -> 获取邮箱验证码
   */
  static get GET_EMAIL() { return this.API + '/email/sendAuthcodeToEmail' }

  /**
   * @description 邮箱 ->邮箱验证码验证
   */
  static get GET_EMAIL_VERIFICATION() { return this.API + '/email/verifyAuthcode' }

  /**
   * @description 邮箱验证、验证邮箱是否存在
   */
  static get GET_ACCOUNTEMAIL_VERIFICATION() { return this.API + '/email/checkEmail' }

  /**
   * @description 账号验证、工号验证、学号验证是否存在
   */
  static get GET_ACCOUNT_VERIFICATION() { return this.API + '/email/getUserByUserAccount' }
  
  /**
   * @description 我的消息
   */
  static MESSAGE = class MESSAGE extends Config {
    /**
     * @description 我的消息 -> 未读消息/历史消息 -> 数据别表
     */
    static get MESSAGE_LOAD() { return this.API + '/message/selectMessageByPage' }

    /**
     * @description 我的消息 -> 未读消息 -> 知道了
     */
    static get MESSAGE_KNOW() { return this.API + '/message/setIsRead' }

    /**
     * @description 我的消息 -> 未读消息 -> 全部已读
     */
    static get MESSAGE_ALLKNOW() { return this.API + '/message/setAllRead' }

    /**
     * @description 我的消息 -> 未读消息 -> 删除
     */
    static get DELETE_KNOW() { return this.API + '/message/deleteByIds' }  

    /**
     * @description 我的消息 -> 未读消息 -> 删除所有
     */
    static get DELETE_ALLKNOW() { return this.API + '/message/deleteAllMessage' }  
  }

  /**
   * @description 个人设置
   */
  static PERSONALCENTER = class PERSONALCENTER extends Config {
    /**
     * @description 个人设置 -> 修改密码
     */
    static get PERSONALCENTER_PASSWORD() { return this.API + '/user/updatePassword' }

    /**
     * @description 个人设置 -> 修改个人信息
     */
    static get PERSONALCENTER_INFO() { return this.API + '/user/updateUser' }

    /**
     * @description 个人设置 -> iLab绑定校内用户
     */
    static get PERSONALCENTER_BINDUSER() { return this.API + '/ilab/bindSchoolAccount' }

    /**
     * @description 个人设置 -> iLab接触校内用户绑定
     */
    static get PERSONALCENTER_REMOVEBIND() { return this.API + '/ilab/removeBindToSchoolAccount' }

    /**
     * @description 个人设置 -> 个人信息 -> 头像设置 -> 获取系统头像
     */
    static get PERSONALCENTER_GETIMAGE() { return this.API + '/systemPhoto/selectSystemPhoto' }

    /**
     * @description 个人设置 -> 个人信息 -> 头像设置 -> 自定义图片 裁剪后的图片上传
     */
    static get PERSONALCENTER_CUSTOMIMAGE() { return this.API + '/user/uploadPhoto' }
  }

  /**
   * @description 班级 相关
   */
  static CLASS = class CLASS extends Config {
    /**
     * @description 加入班级 -> 班级号查询班级
     */
    static get CLASS_QUERY() { return this.API + '/classes/selectClassByClassNumber' }

    /**
     * @description 加入班级 -> 确认加入班级
     */
    static get CLASS_ADDCLASS() { return this.API + '/classes/studentJoinClass' }

    /**
     * @description 我的班级 -> 新建班级 -> 查询年级
     */
    static get CLASS_GRADE() { return this.API + '/classes/selectGradeName' }

    /**
     * @description 我的班级 -> 新建班级 -> 新建班级
     */
    static get CLASS_NEWCLASS() { return this.API + '/classes/createClassForSelf' }

    /**
     * @description 我的班级 -> 分页列表
     */
     static get CLASS_PAGELIST() { return this.API + '/classes/selectMyClassByCondition' }

    /**
     * @description 我的班级 -> 查看班级成员 -> 数据列表、分页列表
     */
    static get MEMBERS_PAGELIST() { return this.API + '/classes/selectStudentByClassId' }

    /**
     * @description 我的班级 -> 查看班级成员 -> 移除班级学生
     */
    static get MEMBERS_REMOVESTUDENT() { return this.API + '/classes/deleteStudentByTeacher' }
  }

  /**
   * @description 后台管理 相关
   */
  static MANAGE = class MANAGE extends Config {
    /**
     * @description 后台管理 -> 班级管理 -> 数据列表、分页列表
     */
    static get MANAGE_CLASS_PAGELIST() { return this.API + '/classes/adminSelectClass' }
    
    /**
     * @description 后台管理 -> 班级管理 -> 删除、批量删除
     */
    static get MANAGE_CLASS_DELETE() { return this.API + '/classes/adminDeleteClass' }

    /**
     * @description 后台管理 -> 班级管理 -> 新建班级
     */
    static get MANAGE_CLASS_ADD() { return this.API + '/classes/insertClassByAdmin' }

    /**
     * @description 后台管理 -> 班级管理 -> 编辑 -> 班级名和授课教师验证，验证班级是否存在
     */
    static get MANAGE_CLASS_VERIFICATION() { return this.API + '/classes/verifyClassExist' }

    /**
     * @description 后台管理 -> 班级管理 -> 更新、提交
     */
    static get MANAGE_CLASS_UPDATACLASS() { return this.API + '/classes/adminUpdateClass' }

    /**
     * @description 后台管理 -> 用户管理 -> 数据列表、分页列表
     */
    static get MANAGE_USER_PAGELIST() { return this.API + '/user/selectUser' }

    /**
     * @description 后台管理 -> 用户管理 -> 删除、批量删除
     */
    static get MANAGE_USER_DELETE() { return this.API + '/user/deleteUser' }

    /**
     * @description 后台管理 -> 用户管理 -> 新建用户，新增
     */
    static get MANAGE_USER_ADD() { return this.API + '/user/adminInsertUser' }

    /**
     * @description 后台管理 -> 用户管理 -> 更新、编辑
     */
    static get MANAGE_USER_UPDATA() { return this.API + '/user/adminUpdateUser' }
    
    /**
     * @description 后台管理 -> 用户管理 -> 学生批量导入
     */
    static get MANAGE_USER_BATCHIMPORT() { return this.API + '/user/excelUser' }

    /**
     * @description 后台管理 -> 权限管理 -> 获取所有操作权限
     */
    static get MANAGE_POWER_GETPOWER() { return this.API + '/menu/selectMenuOrInterface' }

    /**
     * @description 后台管理 -> 权限管理 -> 获取以拥有操作权限
     */
    static get MANAGE_POWER_ROLEPOWER() { return this.API + '/permission/getPermissionByRoleId' }

    /**
     * @description 后台管理 -> 权限管理 -> 变更操作权限、赋予权限
     */
    static get MANAGE_POWER_HANDLEPOWER() { return this.API + '/permission/givePermissionToRole' }

    /**
     * @description 后台管理 -> 权限管理 -> 获取数据权限、获取所有角色
     */
    static get MANAGE_POWER_GETROLE() { return this.API + '/role/getRole' }

    /**
     * @description 后台管理 -> 权限管理 -> 变更数据权限、变更数据权限等级
     */
     static get MANAGE_POWER_CHANGEPOWER() { return this.API + '/role/updateLevel' }
  }

  /**
   * @description 忘记密码 相关
   */
  static FORGET = class FORGET extends Config {
    /**
     * @description 忘记密码 -> 账号是否存在
     */
    static get FORGET_ACCOUNT() { return this.API + '/user/getOneByUser' }

    /**
     * @description 忘记密码 -> 账号存在 -> 获取邮箱
     */
    static get FORGET_ACCOUNT_EMAIL() { return this.API + '/email/selectEmail' }
    
    /**
     * @description 忘记密码 -> 验证通过 -> 修改密码
     */
    static get FORGET_PASSWORD() { return this.API + '/email/updatePwd' }
  }

  /**
   * @description 变更邮箱 相关
   */
  static EMAIL = class EMAIL extends Config {

    /**
     * @description 个人设置 -> 个人信息 -> 更换邮箱 -> 密码验证
     */
     static get EMAIL_PASSWORD() { return this.API + '/email/verifyUser' }

    /**
     * @description 个人设置 -> 个人信息 -> 更换邮箱 -> 邮箱获取验证码
     */
    static get EMAIL_GETEMAIL() { return this.API + '/email/sendAuthcodeToEmailByEmail' }

    /**
     * @description 个人设置 -> 个人信息 -> 更换邮箱 -> 邮箱、验证码验证
     */
    static get EMAIL_EMAILVERIFICATION() { return this.API + '/email/verifyAuthcode' }

    /**
     * @description 个人设置 -> 个人信息 -> 更换邮箱 -> 修改邮箱
     */
    static get EMAIL_PERSONALCENTER_INFO() { return this.API + '/user/updateUser' }
  }

  /**
   * @description 注册 相关
   */
  static REGISTER = class REGISTER extends Config {
    /**
     * @description 注册 -> 提交注册信息
     */
    static get REGISTER() { return this.API + '/login/register' }
  }
}