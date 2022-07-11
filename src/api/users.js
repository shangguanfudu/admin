import request from '@/utils/request'

/** 获取用户列表
 * @query可选查询参数
 * @pagenum必填当前页码
 * @pagesize每页显示条数必填
 */
export const getUsers = ({ query, pagenum, pagesize }) => {
  return request({
    url: 'users',
    params: { query, pagenum, pagesize }
  })
}

/** 添加用户
 * @username必填
 * @password必填
 * @email可选
 * @mobile可选
 */
export const addUser = ({ username, password, email, mobile }) => {
  return request({
    method: 'POST',
    url: 'users',
    data: { username, password, email, mobile }
  })
}

/** 修改用户状态
 * @uId 用户必填
 * @type 用户状态必填 true/false
 */
export const putState = (uId, type) => {
  return request({
    method: 'PUT',
    url: `users/${uId}/state/${type}`
  })
}
/** 编辑用户提交
 *
 */
export const putEdit = (id, email, mobile) => {
  return request({
    method: 'PUT',
    url: `users/${id}`,
    data: {
      email: email,
      mobile: mobile
    }
  })
}
/** 删除用户
 * @id
 */
export const delUser = (id) => {
  return request({
    method: 'DELETE',
    url: `users/${id}`
  })
}
/** 分配用户角色
 * @id
 * @rid 角色id
 */
export const putRole = (id, rid) => {
  return request({
    method: 'PUT',
    url: `users/${id}/role`,
    data: {
      rid: rid
    }
  })
}
