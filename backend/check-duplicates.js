const mysql = require('mysql2/promise');

const configs = [
  {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'userphot_main',
  }
];

async function test() {
  let conn;
  try {
    conn = await mysql.createConnection(configs[0]);
    console.log('Connected successfully!');
    
    // Check master content_sections duplicates
    const [rows] = await conn.execute('SELECT section_name, COUNT(*) as count FROM content_sections GROUP BY section_name HAVING count > 1');
    console.log('Duplicate section_names in master:', rows);

    // Let's check tenants
    const [tenants] = await conn.execute('SELECT * FROM tenants');
    for (const tenant of tenants) {
      try {
        const [tRows] = await conn.execute(`SELECT section_name, COUNT(*) as count FROM \`${tenant.db_name}\`.content_sections GROUP BY section_name HAVING count > 1`);
        if (tRows.length > 0) {
          console.log(`Duplicate section_names in tenant ${tenant.db_name}:`, tRows);
        }
      } catch (err) {
        // ignore
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    if (conn) await conn.end();
  }
}

test();
