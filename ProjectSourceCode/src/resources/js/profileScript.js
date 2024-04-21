console.log("Profile js")
const giphyUrl = `https://api.giphy.com/v1/gifs/random?api_key=2zhxuAMBZ6D0JYvhc8rDcaLL19DEqq0A&limit=1&rating=g`

fetch(giphyUrl)
    .then(response => response.json())
    .then(apiData => {
        console.log(apiData)
    })


