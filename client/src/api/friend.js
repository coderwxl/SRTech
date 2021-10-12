import request from '@/utils/request'

export function getFriendList() {
  return request({
    url: '/friend',
    method: 'get'
  })
}

export function getFriendDetail(id) {
  return request({
    url: '/friend/' + id,
    method: 'get'
  })
}

