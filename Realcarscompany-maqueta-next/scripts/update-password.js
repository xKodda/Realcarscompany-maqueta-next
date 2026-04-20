const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users:', users);

  const hash = await bcrypt.hash('Real2021$$$', 10);
  
  if (users.length > 0) {
    const updatedUser = await prisma.user.update({
      where: { id: users[0].id },
      data: { passwordHash: hash }
    });
    console.log('Updated user password for:', updatedUser.email);
  } else {
    // If no user exists, create one
    const newUser = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@realcars.cl',
        passwordHash: hash,
        role: 'admin',
        isActive: true,
      }
    });
    console.log('Created new admin user:', newUser.email);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
