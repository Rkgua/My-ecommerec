import { config } from 'dotenv';
import { resolve } from 'path';
// ✅ 修改点 1: 在文件顶部静态导入 PrismaClient
// 这样能确保模块在运行前就完全加载并绑定好环境变量配置
import { PrismaClient } from '@prisma/client';

// 加载 .env
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });

// 实例化放在 main 外面或里面都可以，但建议放在里面以便控制生命周期
// 注意：由于是静态导入，这里不需要 await import 了
async function main() {
  const prisma = new PrismaClient();

  console.log(`Start seeding ...`);

  try {
    const products = [
      {
        name: 'Sony WH-1000XM5 无线降噪耳机',
        description: '业界领先的降噪处理器，30小时超长续航，支持多点连接，佩戴舒适。',
        price: 2499.00,
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'
        ],
        category: 'Electronics',
      },
      {
        name: '纯棉复古水洗牛仔裤',
        description: '经典直筒版型，采用100%纯棉面料，经过复古水洗工艺，柔软透气。',
        price: 399.50,
        stock: 120,
        images: [
          'https://images.unsplash.com/photo-1542272617-08f08630329e?w=800'
        ],
        category: 'Clothing',
      },
      {
        name: '北欧极简陶瓷花瓶',
        description: '手工烧制，哑光磨砂质感，线条流畅，适合现代家居客厅装饰。',
        price: 128.00,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1581783342308-f792ca11df53?w=800',
          'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800',
          'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'
        ],
        category: 'Home & Living',
      },
    ];

    for (const p of products) {
      const product = await prisma.product.create({
        data: p,
      });
      console.log(`Created product with id: ${product.id}`);
    }

    console.log(`Seeding finished.`);
  } catch (e) {
    console.error('Error during seeding:', e);
    throw e;
  } finally {
    await prisma.$disconnect();
    console.log('Database disconnected.');
  }
}

main()
  .catch((e) => {
    console.error('Unhandled error:', e);
    process.exit(1);
  });