
const getTime = () => {
    let time = [];
    for (let i = 0; i < 48; i++) {
      // let name = ''
      let _hour = (Math.floor(i/2))
      let _secend =  i%2 == 0 ? '00' : '30'

        time.push({
            name: (_hour > 9? _hour : '0' + _hour) + ':' + _secend,
            value: i
        })
    }
    return time;
}
const getWeek = ()=>{
    return [
        {
            name: "周一",
            value: 1
        },
        {
            name: "周二",
            value: 2
        },
        {
            name: "周三",
            value: 3
        },
        {
            name: "周四",
            value: 4
        },
        {
            name: "周五",
            value: 5
        },
        {
            name: "周六",
            value: 6
        },
        {
            name: "周日",
            value: 7
        }
    ]
}

const getDate = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let d = new Date(year, month, 0);
    let days = d.getDate();
    let dates = [];
    for (let i = 1; i <= days; i++) {
        dates.push({
            name: `${i}号`,
            value: i
        })
    }
    return dates;
}

export {
    getTime,
    getWeek,
    getDate,
}
