console.log("Profile js")
// console.log(Date.now, "Hello")
const displayDate = String(new Date())
const dateArr = displayDate.split(" ")
const dateEl = document.getElementById("date")
const timeEl = document.getElementById('time')
console.log(displayDate, "DATE")
console.log(dateArr)
dateEl.innerText = dateArr[0] + " " + dateArr[1] + " " + dateArr[2] + " " + dateArr[3]


//Giphy API may use
// const giphyUrl = `https://api.giphy.com/v1/gifs/random?api_key=2zhxuAMBZ6D0JYvhc8rDcaLL19DEqq0A&limit=1&rating=g`
// fetch(giphyUrl)
// .then(response => response.json())
// .then(apiData => {
//         console.log(apiData)
//     })
// .catch(err =>{
//     console.log(err)
// })


setInterval(function () {
    const displayDate = String(new Date())
    const dateArr = displayDate.split(" ")
    timeEl.innerText = dateArr[4]
}, 1000)