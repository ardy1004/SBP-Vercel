const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ljnqmfwbphlrlslfwjbr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbnFtZndicGhscmxzbGZ3amJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MjMxMTAsImV4cCI6MjA3Nzk5OTExMH0.b8rwq4qIU_9_qOWnNrjETcW2eEPwjL5zktBnGQsbm3s'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')

    const { data, error } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .limit(1)

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log('Connection successful!')
    console.log('Total properties:', data?.length || 0)
    console.log('Sample data:', data?.[0] || 'No data')

  } catch (err) {
    console.error('Connection failed:', err)
  }
}

testConnection()