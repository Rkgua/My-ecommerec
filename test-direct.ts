// test-direct.ts
import { config } from 'dotenv';
config();

async function test() {
  console.log('DB URL Length:', process.env.DATABASE_URL?.length);

  // 直接导入生成好的客户端
  // 注意：这里不使用动态 import，看看静态导入是否有区别
  const { PrismaClient } = require('@prisma/client'); 
  
  try {
    console.log('正在实例化...');
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