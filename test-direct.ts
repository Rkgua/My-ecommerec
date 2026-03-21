import { config } from 'dotenv';
// 引入 PrismaClient
import { PrismaClient } from '@prisma/client';

config();

async function test() {
  console.log('DB URL Length:', process.env.DATABASE_URL?.length);

  try {
    console.log('正在实例化...');
    // 直接使用导入的类，不再需要 require
    const prisma = new PrismaClient();
    console.log('✅ 实例化成功！');

    await prisma.$connect();
    console.log('✅ 连接成功！');
    await prisma.$disconnect();
  } catch (e) {
    console.error('❌ 失败:', e);
  }
}

test();
