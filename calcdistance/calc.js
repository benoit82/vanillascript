/**
 *
 * @param {*} city1
 * @param {*} city2
 */
function getDistanceFromLatLonInKm (city1, city2) {
  const coordinates1 = city1.centre.coordinates
  const coordinates2 = city2.centre.coordinates
  const deg2rad = deg => deg * (Math.PI / 180)
  const EARTH_RADIUS = 6371
  const dLat = deg2rad(coordinates2[0] - coordinates1[0]) // deg2rad below
  const dLon = deg2rad(coordinates2[1] - coordinates1[1])
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coordinates1[0])) *
      Math.cos(deg2rad(coordinates2[0])) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(EARTH_RADIUS * c) // Distance in km
}

async function getCity (cityName) {
  const urlGeoApi = `https://geo.api.gouv.fr/communes?fields=nom,departement,centre&format=json&geometry=centre&boost=population&limit=5&nom=${cityName}`
  const res = await fetch(urlGeoApi)
  const txt = await res.text()
  return JSON.parse(txt)
}
async function getCityByCode (codeINSEE) {
  const urlGeoApi = `https://geo.api.gouv.fr/communes/${codeINSEE}?fields=centre&format=json&geometry=centre`
  const res = await fetch(urlGeoApi)
  const txt = await res.text()
  return JSON.parse(txt)
}

async function calc (elements) {
  const cities = [elements[0].selected, elements[1].selected]
  if (cities[0] !== '' && cities[1] !== '') {
    const spanDist = document.getElementById('distance')
    spanDist.innerHTML = ''

    const city1 = await getCityByCode(cities[0])
    const city2 = await getCityByCode(cities[1])

    spanDist.innerHTML = getDistanceFromLatLonInKm(city1, city2) + ' km'
  }
}

async function main () {
  const elements = [
    { id: 'city1', selected: '' },
    { id: 'city2', selected: '' }
  ]
  elements.forEach(cityInputEl => {
    document
      .getElementById(cityInputEl.id)
      .addEventListener('input', async event => {
        const searchElement = event.target
        const cities = await getCity(searchElement.value)
        document.getElementById('calculate').disabled = cities.length === 0
        const ulList = document.getElementById(searchElement.id + '_list')
        ulList.innerHTML = ''
        cities.forEach(city => {
          const li = document.createElement('li')
          li.innerHTML = `${city.nom} - ${city.departement.code} ${city.departement.nom}`
          li.setAttribute('data-cityCode', city.code)
          ulList.appendChild(li)
        })
        ulList.firstChild.classList.add('selected')
      })
    document
      .getElementById(cityInputEl.id)
      .addEventListener('keydown', async event => {
        const searchElement = event.target
        const cities = await getCity(searchElement.value)
        const ulList = document.getElementById(searchElement.id + '_list')
        if (cities.length > 0) {
          if (['Enter', 'NumpadEnter'].includes(event.code)) {
            ulList.childNodes.forEach(li => {
              if (li.classList.contains('selected')) {
                event.target.value = li.textContent
                cityInputEl.selected = li.getAttribute('data-cityCode')
                event.target.blur()
              }
            })
          } else if (['ArrowDown', 'ArrowUp'].includes(event.code)) {
            ulList.childNodes.forEach(li => {
              if (li.classList.contains('selected')) {
                if (event.code === 'ArrowDown' && li.nextSibling) {
                  li.classList.remove('selected')
                  const nextLi = li.nextSibling
                  nextLi.classList.add('selected')
                  event.target.value = nextLi.textContent.split(' ').shift()
                  return false
                }
                if (event.code === 'ArrowUp' && li.previousSibling) {
                  li.classList.remove('selected')
                  const prevLi = li.previousSibling
                  prevLi.classList.add('selected')
                  event.target.value = prevLi.textContent.split(' ').shift()
                }
              }
            })
          }
        }
      })
    document.getElementById(cityInputEl.id).addEventListener('blur', event => {
      document.getElementById(event.target.id + '_list').innerHTML = ''
    })

    document.getElementById('calculate').addEventListener('click', ev => {
      calc(elements)
    })
  })
}

main()
