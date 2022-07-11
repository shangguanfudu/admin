import request from '@/utils/request'

/** 获得参数列表
 * @:id分类 ID不能为空 携带在url中
 * @sel [only,many]不能为空,通过 only 或 many 来获取分类静态参数还是动态参数
 */
export const getParams = (id, sel) => {
  return request({
    url: `categories/${id}/attributes`,
    params: { sel }
  }
  )
}
/** 添加参数
 *请求路径：categories/:id/attributes
 :id分类ID不能为空
 */
// eslint-disable-next-line camelcase
export const addParams = (id, attr_name, attr_sel) => {
  return request({
    method: 'POST',
    url: `categories/${id}/attributes`,
    data: {
      attr_name, attr_sel
    }
  }
  )
}
/** 编辑参数提交
 * @attr_vals可选参数
 */
// eslint-disable-next-line camelcase
export const putEdit = ({ id, attrId, attr_name, attr_sel, attr_vals }) => {
  return request({
    method: 'PUT',
    url: `categories/${id}/attributes/${attrId}`,
    data: {
      attr_name,
      attr_sel,
      attr_vals
    }
  })
}
/** 删除参数
 * @id
 */
export const delParam = (id, attrId) => {
  return request({
    method: 'DELETE',
    url: `categories/${id}/attributes/${attrId}`
  })
}
