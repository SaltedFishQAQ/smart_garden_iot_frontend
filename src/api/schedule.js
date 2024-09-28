import request from '@/utils/request'

export function getScheduleList(params) {
  return request({
    url: '/schedules',
    method: 'get',
    params: params
  })
}

export function updateSchedule(data) {
  return request({
    url: '/schedules',
    method: 'put',
    data
  })
}

export function createSchedule(data) {
  return request({
    url: '/schedules',
    method: 'post',
    data
  })
}

export function running(data) {
  return request({
    url: '/schedules/running',
    method: 'post',
    data
  })
}
