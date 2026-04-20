const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    const admins = await prisma.adminUser.findMany()
    console.log('User records:', JSON.stringify(users))
    console.log('AdminUser records:', JSON.stringify(admins))
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
