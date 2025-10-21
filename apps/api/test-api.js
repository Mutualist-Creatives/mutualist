const baseUrl = 'http://localhost:3002/api';

async function testAPI() {
  console.log('🧪 Testing API Endpoints\n');

  // Test 1: GET all portfolios
  console.log('1️⃣ GET /api/portfolios');
  const allPortfolios = await fetch(`${baseUrl}/portfolios`);
  const portfolios = await allPortfolios.json();
  console.log(`✅ Found ${portfolios.length} portfolios\n`);

  // Test 2: GET categories
  console.log('2️⃣ GET /api/portfolios/categories');
  const categoriesRes = await fetch(`${baseUrl}/portfolios/categories`);
  const categories = await categoriesRes.json();
  console.log(`✅ Categories:`, categories, '\n');

  // Test 3: GET single portfolio
  const firstId = portfolios[0].id;
  console.log(`3️⃣ GET /api/portfolios/${firstId}`);
  const singleRes = await fetch(`${baseUrl}/portfolios/${firstId}`);
  const single = await singleRes.json();
  console.log(`✅ Got portfolio:`, single.title, '\n');

  // Test 4: POST create portfolio
  console.log('4️⃣ POST /api/portfolios');
  const createRes = await fetch(`${baseUrl}/portfolios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Test Project',
      createdBy: 'Test User',
      year: '2024',
      category: 'Testing',
      description: 'This is a test project',
      images: ['https://example.com/test.jpg'],
    }),
  });
  const created = await createRes.json();
  console.log(`✅ Created portfolio:`, created.title, 'ID:', created.id, '\n');

  // Test 5: PUT update portfolio
  console.log(`5️⃣ PUT /api/portfolios/${created.id}`);
  const updateRes = await fetch(`${baseUrl}/portfolios/${created.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Updated Test Project',
      description: 'Updated description',
    }),
  });
  const updated = await updateRes.json();
  console.log(`✅ Updated portfolio:`, updated.title, '\n');

  // Test 6: DELETE portfolio
  console.log(`6️⃣ DELETE /api/portfolios/${created.id}`);
  const deleteRes = await fetch(`${baseUrl}/portfolios/${created.id}`, {
    method: 'DELETE',
  });
  console.log(`✅ Deleted portfolio (Status: ${deleteRes.status})\n`);

  console.log('🎉 All tests passed!');
}

testAPI().catch(console.error);
