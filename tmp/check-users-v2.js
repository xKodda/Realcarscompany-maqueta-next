const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            role: true,
            isActive: true
        }
    })
    console.log('USERS_LIST_START')
    console.log(JSON.stringify(users))
    console.log('USERS_LIST_END')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
