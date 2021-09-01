import dayjs from 'dayjs'

export default {
  methods: {
    DateTimeFormat(datetime, format) {
      return dayjs(datetime).format(format)
    }
  }
}
