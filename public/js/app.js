const $messages = document.querySelector('table #sinhvienjs')
const datad = document.querySelector('#data-template').innerHTML

let jSONData = []
axios({
    method: 'get',
    url: 'http://54.169.150.16:3000/sinhvien'
})
    .then((result) => {
        console.log(result.data)
        jSONData = result.data
        for (let i = 0; i < result.data.length; i++) {
            const html = Mustache.render(datad, {
                ...result.data[i]
            })
            $messages.insertAdjacentHTML('beforeend', html)
        }
        console.log($messages)
    })


const addSP = document.getElementById('them').addEventListener('click', (e) => {
    axios({
        method: 'post',
        url: 'http://54.169.150.16:3000/sinhvien',
        data: {
            masp: document.getElementById('masp').value,
            tensp: document.getElementById('tensp').value,
            sl: document.getElementById('sl').value,
            
        }
    })
        .then((result) => {
            console.log(result)
        })
})

