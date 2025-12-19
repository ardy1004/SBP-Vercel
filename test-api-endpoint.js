async function testAPI() {
  try {
    console.log('Testing API endpoint...')

    const response = await fetch('http://localhost:3000/api/properties?page=1&limit=20')
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      return
    }

    const data = await response.json()
    console.log('Success! Data:', JSON.stringify(data, null, 2))

  } catch (err) {
    console.error('Fetch failed:', err)
  }
}

testAPI()