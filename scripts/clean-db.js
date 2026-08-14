const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const codes = await prisma.verificationCode.deleteMany();
  const txs = await prisma.transaction.deleteMany();
  const budgets = await prisma.budget.deleteMany();
  const goals = await prisma.goal.deleteMany();
  const users = await prisma.user.deleteMany();

  console.log(`Successfully deleted ${users.count} users, ${codes.count} verification codes, ${txs.count} transactions, ${budgets.count} budgets, and ${goals.count} goals.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
