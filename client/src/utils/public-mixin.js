// import dayjs from 'dayjs'

export default {
  methods: {
    // DateTimeFormat(datetime, format) {
    //   return dayjs(datetime).format(format)
    // },
    getAge(date) {
      console.log(date)
      let age = 0
      let friendDate = new Date(date);
      let now = new Date()
      if (now.getMonth() > friendDate.getMonth()) {
        age = now.getFullYear() - friendDate.getFullYear()
      } else if (now.getMonth() < friendDate.getMonth()) {
        age = now.getFullYear() - friendDate.getFullYear() - 1
      } else {
        if (now.getDate() >= friendDate.getDate()) {
          age = now.getFullYear() - friendDate.getFullYear()
        } else {
          age = now.getFullYear() - friendDate.getFullYear() - 1
        }
      }
      
      return age
    }
  }
}
