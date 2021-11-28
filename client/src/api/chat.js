import request from '@/utils/request'

export function getChatList() {
  return request({
    url: '/chat/list',
    method: 'get'
  })
}

export function getChatDetail(chatID) {
  return request({
    url: '/chat/list/' + chatID,
    method: 'get'
  })
}

export function sendMessage(id, msg) {
  return request({
    url: '/chat/message',
    method: 'post',
    data: { 
      chatID: id,
      message: msg
    }
  })
}