import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function importProperties() {
  try {
    console.log('🚀 Starting property import...')

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', '..', 'properties_inserts.sql')
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')

    // Extract INSERT statements for properties
    const insertRegex = /INSERT INTO public\.properties \([^)]+\) VALUES \([^;]+\);/g
    const insertStatements = sqlContent.match(insertRegex)

    if (!insertStatements) {
      console.error('❌ No INSERT statements found')
      return
    }

    console.log(`📊 Found ${insertStatements.length} property records to import`)

    // Parse and insert each property
    for (let i = 0; i < insertStatements.length; i++) {
      const statement = insertStatements[i]
      console.log(`📝 Processing property ${i + 1}/${insertStatements.length}...`)

      // Extract values from INSERT statement
      const valuesMatch = statement.match(/VALUES \(([^)]+)\)/)
      if (!valuesMatch) continue

      const values = valuesMatch[1]
      const valueArray = parseInsertValues(values)

      if (valueArray.length >= 30) { // Ensure we have all required fields
        const propertyData = {
          id: valueArray[0].replace(/'/g, ''),
          kode_listing: valueArray[1].replace(/'/g, ''),
          judul_properti: valueArray[2].replace(/'/g, '') || null,
          deskripsi: valueArray[3].replace(/'/g, '') || null,
          jenis_properti: valueArray[4].replace(/'/g, ''),
          luas_tanah: valueArray[5] ? parseFloat(valueArray[5]) : null,
          luas_bangunan: valueArray[6] ? parseFloat(valueArray[6]) : null,
          kamar_tidur: valueArray[7] ? parseInt(valueArray[7]) : null,
          kamar_mandi: valueArray[8] ? parseInt(valueArray[8]) : null,
          legalitas: valueArray[9].replace(/'/g, '') || null,
          harga_properti: valueArray[10] ? parseFloat(valueArray[10]) : 0,
          provinsi: valueArray[11].replace(/'/g, ''),
          kabupaten: valueArray[12].replace(/'/g, ''),
          kecamatan: valueArray[30] ? valueArray[30].replace(/'/g, '') : null,
          kelurahan: valueArray[31] ? valueArray[31].replace(/'/g, '') : null,
          alamat_lengkap: valueArray[13].replace(/'/g, '') || null,
          image_url: valueArray[14].replace(/'/g, ''),
          image_url1: valueArray[15] ? valueArray[15].replace(/'/g, '') : null,
          image_url2: valueArray[16] ? valueArray[16].replace(/'/g, '') : null,
          image_url3: valueArray[17] ? valueArray[17].replace(/'/g, '') : null,
          image_url4: valueArray[18] ? valueArray[18].replace(/'/g, '') : null,
          is_premium: valueArray[19] === 'true',
          is_featured: valueArray[20] === 'true',
          is_hot: valueArray[21] === 'true',
          is_sold: valueArray[22] === 'true',
          price_old: valueArray[23] && valueArray[23] !== 'NULL' ? parseFloat(valueArray[23]) : null,
          is_property_pilihan: valueArray[24] === 'true',
          owner_contact: valueArray[25] ? valueArray[25].replace(/'/g, '') : null,
          status: valueArray[26].replace(/'/g, ''),
          created_at: valueArray[27].replace(/'/g, ''),
          updated_at: valueArray[28].replace(/'/g, ''),
          image_url5: valueArray[29] ? valueArray[29].replace(/'/g, '') : null,
          image_url6: valueArray[30] ? valueArray[30].replace(/'/g, '') : null,
          image_url7: valueArray[31] ? valueArray[31].replace(/'/g, '') : null,
          image_url8: valueArray[32] ? valueArray[32].replace(/'/g, '') : null,
          image_url9: valueArray[33] ? valueArray[33].replace(/'/g, '') : null
        }

        // Insert into Supabase
        const { error } = await supabase
          .from('properties')
          .upsert(propertyData, { onConflict: 'id' })

        if (error) {
          console.error(`❌ Error inserting property ${propertyData.kode_listing}:`, error)
        } else {
          console.log(`✅ Successfully imported property ${propertyData.kode_listing}`)
        }
      }
    }

    console.log('🎉 Property import completed!')
  } catch (error) {
    console.error('❌ Import failed:', error)
  }
}

function parseInsertValues(valuesString) {
  // Simple parser for PostgreSQL INSERT VALUES
  const values = []
  let current = ''
  let inQuotes = false
  let quoteChar = ''

  for (let i = 0; i < valuesString.length; i++) {
    const char = valuesString[i]

    if (!inQuotes && (char === "'" || char === '"')) {
      inQuotes = true
      quoteChar = char
      current += char
    } else if (inQuotes && char === quoteChar) {
      inQuotes = false
      current += char
    } else if (!inQuotes && char === ',') {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  if (current.trim()) {
    values.push(current.trim())
  }

  return values
}

// Run the import
importProperties()