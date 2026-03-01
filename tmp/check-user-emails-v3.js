const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    console.log('USER_EMAILS_START')
    users.forEach(u => console.log(`- Email: "${u.email}", Role: "${u.role}", Active: ${u.isActive}`))
    console.log('USER_EMAILS_END')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
