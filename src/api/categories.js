import request from '@/utils/request'

/** 获得分类列表
 * @type[1,2,3]值：1，2，3 分别表示显示一层二层三层分类列表
【可选参数】如果不传递，则默认获取所有级别的分类
* @pagenum 当前页码值【可选参数】如果不传递，则默认获取所有分类
* @pagesize 每页显示多少条数据【可选参数】如果不传递，则默认获取所有分类
*/
export const getCat = ({ type, pagenum, pagesize }) => {
  return request({
    url: 'categories',
    params: { type, pagenum, pagesize }
  })
}
/** 编辑分类提交
 *
 */
// eslint-disable-next-line camelcase
export const putEdit = (id, cat_name) => {
  return request({
    method: 'PUT',
    url: `categories/${id}`,
    data: {
      cat_name
    }
  })
}
/** 删除分类
 * @id
 */
export const delCat = (id) => {
  return request({
    method: 'DELETE',
    url: `categories/${id}`
  })
}
/** 添加分类
 * @cat_pid 分类父ID不能为空，如果要添加 1 级分类，则父分类 Id 应该设置为 0
 * @cat_level 分类层级不能为空，0表示一级分类；1表示二级分类；2表示三级分类
 */
// eslint-disable-next-line camelcase
export const addCat = ({ cat_pid, cat_name, cat_level }) => {
  return request({
    method: 'POST',
    url: 'categories',
    data: { cat_pid, cat_name, cat_level }
  })
}
