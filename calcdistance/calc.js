/**
 *
 * @param {*} city1
 * @param {*} city2
 */
function getDistanceFromLatLonInKm (city1, city2) {
  const coordinates1 = city1.centre.coordinates
  const coordinates2 = city2.centre.coordinates
  const deg2rad = deg => deg * (Math.PI / 180)
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(coordinates2[0] - coordinates1[0]) // deg2rad below
  const dLon = deg2rad(coordinates2[1] - coordinates1[1])
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coordinates1[0])) *
      Math.cos(deg2rad(coordinates2[0])) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c) // Distance in km
}

async function getCity (cityName) {
  const urlGeoApi = `https://geo.api.gouv.fr/communes?fields=nom,departement,centre&format=json&geometry=centre&boost=population&limit=5&nom=${cityName}`
  const res = await fetch(urlGeoApi)
  const txt = await res.text()
  return JSON.parse(txt)
}
async function getCities (element) {
  const ulList = document.getElementById(element.id + '_list')
  const cities = await getCity(element.value)
  ulList.innerHTML = ''
  cities.forEach(city => {
    const li = document.createElement('li')
    li.innerHTML = `${city.nom} - ${city.departement.code} ${city.departement.nom}`
    ulList.appendChild(li)
  })

  const cities1 = await getCity(document.getElementById('city1').value)
  const cities2 = await getCity(document.getElementById('city2').value)

  const btnCalc = document.getElementById('calculate')
  if (cities1.length > 0 && cities2.length > 0) {
    btnCalc.disabled = false
  } else {
    btnCalc.disabled = true
  }
}

async function calc () {
  const spanDist = document.getElementById('distance')
  spanDist.innerHTML = ''

  const cities1 = await getCity(document.getElementById('city1').value)
  const cities2 = await getCity(document.getElementById('city2').value)

  if (cities1.length > 0 && cities2.length > 0) {
    spanDist.innerHTML =
      getDistanceFromLatLonInKm(cities1.shift(), cities2.shift()) + ' km'
  }
}

async function main () {
  calc()
  getCities(null)
}

main()
