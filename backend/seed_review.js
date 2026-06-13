const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const org = await prisma.user.findFirst({ where: { email: 'test_org123@test.com' } });
  if (!org) return console.log('no org');

  let vol = await prisma.user.findFirst({ where: { email: 'vol@test.com' } });
  if (!vol) {
    vol = await prisma.user.create({
      data: { email: 'vol@test.com', password: await bcrypt.hash('password123', 10), name: 'Тестовий Волонтер', role: 'VOLUNTEER' }
    });
  }

  let need = await prisma.need.findFirst({ where: { title: 'Closed Need For Review', organizerId: org.id } });
  if (!need) {
    need = await prisma.need.create({
      data: { title: 'Closed Need For Review', description: 'Test', location: 'Test', time: 'Test', status: 'CLOSED', organizerId: org.id }
    });
  }

  let app = await prisma.application.findFirst({ where: { needId: need.id, volunteerId: vol.id } });
  if (!app) {
    app = await prisma.application.create({
      data: { needId: need.id, volunteerId: vol.id, status: 'ACCEPTED', options: [] }
    });
  }

  const review = await prisma.review.findFirst({ where: { needId: need.id } });
  if (!review) {
    await prisma.review.create({
      data: { rating: 5, comment: 'Чудовий організатор! Дуже приємно було працювати разом.', needId: need.id, reviewerId: vol.id, revieweeId: org.id }
    });
  }

  console.log('Seeded review!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
