import request from '@/utils/request'

/** 获得权限列表
 * type值 list 或 tree , list 列表显示权限, tree 树状显示权限
 */
export const getRights = (type) => {
  return request({
    url: `rights/${type}`
  })
}
