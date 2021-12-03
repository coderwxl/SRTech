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

export function sendMessage(chatId, friendId, msg) {
  return request({
    url: '/chat/message',
    method: 'post',
    data: { 
      chatID: chatId,
      friendID: friendId,
      message: msg
    }
  })
}

export function sendFile(filedata, pgsfunc) {
  return request({
    url: '/chat/sendfile',
    method: 'post',
    data: filedata,
    onUploadProgress: pgsfunc
  })
}