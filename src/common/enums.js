/**
 * @description 枚举
 */
class Enums {
  /**
   * @description 本地储存
   */
  static get STORAGE() { 
    return { 
      /**
       * @description 用户信息
       */
      get USER() { return 'userinfo' },
      
      /**
       * @description 用户token
       */
      get TOKEN() { return 'token' },
      
      /**
       * @description 账号
       */
      get ACCOUNT() { return 'account' }
    } 
  }

  /**
   * @description 用户角色
   */
  static get ROLE() {
    return {
      /**
       * @description 学生
       */
      get STUDENT() { return 'student' },
      
      /**
       * @description 老师
       */
      get TEECHER() { return 'teacher' },

      /**
       * @description 管理员
       */
      get ADMIN() { return 'admin' },
      
      /**
       * @description 超级管理员
       */
      get SUPER_ADMIN() { return 'superAdmin' },

      /**
       * @description iLab
       */
      get ILAB() { return 'iLab' },

      /**
       * @description 其他
       */
      get OTHER() { return 'other' },

      /**
       * @description 获取权限
       * @returns Enums.ROLE
       * 角色id: 1超级管理员 2管理员 3教师 4学生 5ilab用户
       */
      GET_ROLE(rolename) {
        let role = Enums.ROLE.OTHER;
        switch (rolename) {
          case '4': // 学生
            role = Enums.ROLE.STUDENT;
            break;

          case '3': // 教师
            role = Enums.ROLE.TEECHER;
            break;

          case '2': // 管理员
            role = Enums.ROLE.ADMIN;
            break;
            
          case '1': // 超级管理员
            role = Enums.ROLE.SUPER_ADMIN;
            break;
            
          case '5': // iLab
            role = Enums.ROLE.ILAB;
            break;
          default:
            break;
        }
        return role;
      },
      
      /**
       * @description 获取权限，中文名称
       * @returns Enums.ROLE
       * 角色id: 1超级管理员 2管理员 3教师 4学生 5ilab用户
       */
      GET_ROLENAME(rolename) {
        let roleName = '其他';
        switch (rolename) {
          case '4': // 学生
            roleName = '学生';
            break;
      
          case '3': // 教师
            roleName = '教师';
            break;
      
          case '2': // 管理员
            roleName = '管理员';
            break;
            
          case '1': // 超级管理员
            roleName = '超级管理员';
            break;
            
          case '5': // iLab
            roleName = 'iLab用户';
            break;
          default:
            break;
        }
        return roleName;
      }
    }
  }

  /**
   * @description 性别
   */
  static get SEX() {
    return {
      /**
       * @description 男
       */
      get MEN() { return 0 },

      /**
       * @description 女
       */
      get WOMEN() { return 1},
      
      /**
       * @description 获取性别
       * @returns Enums.ROLE
       * 性别：0 男，1 女
       */
      GET_SEX(rolename) {
        let role = '';
        switch (rolename) {
          case '0':
            role = '男';
            break;
      
          case '1':
            role = '女';
            break;
          default:
            break;
        }
        return role;
      },
    }
  }
}

export default Enums;