const companies = ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft', 'Spotify', 'Stripe', 'Shopify', 'Airbnb']
const titles = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Engineer',
  'Data Scientist', 'DevOps Engineer', 'Product Manager', 'UX Designer',
  'ML Engineer', 'Engineering Manager', 'iOS Developer', 'Android Developer',
  'Security Engineer', 'Cloud Architect', 'QA Engineer',
]
const types = ['Internship', 'Full-time', 'Part-time']
const statuses = ['Applied', 'Interviewing', 'Offer', 'Rejected']

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate() {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * 90))
  return d.toISOString().split('T')[0]
}

async function seed() {
  for (let i = 0; i < 50; i++) {
    const body = {
      company_name: random(companies),
      job_title: random(titles),
      job_type: random(types),
      status: random(statuses),
      applied_date: randomDate(),
      notes: Math.random() > 0.6 ? `Note for application ${i + 1}` : undefined,
    }

    const res = await fetch('http://localhost:3001/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error(`[${i + 1}] FAIL ${res.status}: ${text}`)
    } else {
      const json = await res.json()
      console.log(`[${i + 1}] Created ${json.id} - ${body.company_name} / ${body.job_title}`)
    }
  }
}

seed().then(() => console.log('Done'))
