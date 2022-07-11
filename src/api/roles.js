import request from '@/utils/request'

/** 获得角色列表
 *响应数据说明
第一层为角色信息
第二层开始为权限说明，权限一共有 3 层权限
最后一层权限，不包含 children 属性
 */
export const getRoles = () => {
  return request({
    url: 'roles'
  })
}

/** 添加角色
 * @roleName必填
 * @roleDesc可选
 */
export const addRole = ({ roleName, roleDesc }) => {
  return request({
    method: 'POST',
    url: 'roles',
    data: { roleName, roleDesc }
  })
}
/** 编辑角色提交
 *
 */
export const putEdit = (id, roleName, roleDesc) => {
  return request({
    method: 'PUT',
    url: `roles/${id}`,
    data: {
      roleName,
      roleDesc
    }
  })
}
/** 删除角色
 * @id
 */
export const delRole = (id) => {
  return request({
    method: 'DELETE',
    url: `roles/${id}`
  })
}

/** 角色授权
 * @:roleId
 * @rids 权限列表（字符串）以 , 分割的权限 ID 列表（获取所有被选中、叶子节点的 key 和半选中节点的 key, 包括 1，2，3 级节点）
 */
export const putRight = (roleId, rids) => {
  return request({
    method: 'POST',
    url: `roles/${roleId}/rights`,
    data: { rids }
  })
}
/** 删除角色指定权限 */
export const delRight = (roleId, rightId) => {
  return request({
    method: 'DELETE',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
