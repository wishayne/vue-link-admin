import request from '@/utils/request'

export function permissions() {
  return request({
    url: '/rest/permission/all',
    method: 'get'
  })
}

export function permissionsByRole(data) {
  return request({
    url: `/rest/permission/allByRole/${data}`,
    method: 'get'
  })
}
