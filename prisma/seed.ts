import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // 用于密码加密

// 加载 .env
const envPath = resolve(__dirname, '../.env');
config({ path: envPath });

const prisma = new PrismaClient();

async function main() {
  console.log(`开始播种数据...`);

  try {
    // 1. 创建示例用户
    console.log('创建用户...');
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: await bcrypt.hash('password123', 10), // 生产环境应使用更强的密码
        role: 'ADMIN',
      },
    });

    const regularUser = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        name: 'Regular User',
        password: await bcrypt.hash('password123', 10),
        role: 'USER',
      },
    });

    console.log(`创建了管理员用户: ${adminUser.email}`);
    console.log(`创建了普通用户: ${regularUser.email}`);

    // 2. 清空现有数据（按外键约束顺序删除）
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    console.log('清空了现有数据');

    // 3. 创建3个示例分类
    const categoryElectronics = await prisma.category.create({
      data: { name: '电子产品' }, // 你可以改成 'Electronics' 或任何你喜欢的名字
    });
    const categoryClothing = await prisma.category.create({
      data: { name: '服装' },
    });
    const categoryHousehold = await prisma.category.create({
      data: { name: '家居' },
    });
    // 3. 创建示例产品
    console.log('创建产品...');
    const productsData = [
      {
        name: 'Sony WH-1000XM5 无线降噪耳机',
        description:
          '业界领先的降噪处理器，30小时超长续航，支持多点连接，佩戴舒适。',
        price: 2499.0,
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
        ],
        category: {
          connect: { id: categoryElectronics.id },
        },
      },
      {
        name: '纯棉复古水洗牛仔裤',
        description:
          '经典直筒版型，采用100%纯棉面料，经过复古水洗工艺，柔软透气。',
        price: 399.5,
        stock: 120,
        images: [
          'https://images.unsplash.com/photo-1542272617-08f08630329e?w=800',
        ],
        category: {
          connect: { id: categoryClothing.id },
        },
      },
      {
        name: '北欧极简陶瓷花瓶',
        description: '手工烧制，哑光磨砂质感，线条流畅，适合现代家居客厅装饰。',
        price: 128.0,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1581783342308-f792ca11df53?w=800',
          'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800',
          'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800',
        ],
        category: {
          connect: { id: categoryHousehold.id },
        },
      },
      {
        name: 'MacBook Pro 14英寸 M3芯片',
        description: '专业级性能，Retina显示屏，适用于创意专业人士和开发者。',
        price: 15999.0,
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800',
        ],
        category: {
          connect: { id: categoryElectronics.id },
        },
      },
      {
        name: '不锈钢保温杯 500ml',
        description: '双层真空保温，24小时保冷，48小时保温，便携设计。',
        price: 89.9,
        stock: 200,
        images: [
          'https://images.unsplash.com/photo-1593640408156-685d5e47b8ef?w=800',
        ],
        category: {
          connect: { id: categoryHousehold.id },
        },
      },
    ];

    for (const p of productsData) {
      const product = await prisma.product.create({
        data: p,
      });
      console.log(`创建了产品: ${product.name}`);
    }

    // 4. 创建示例订单
    console.log('创建订单...');
    const order1 = await prisma.order.create({
      data: {
        userId: regularUser.id,
        total: 2627.4,
        status: 'PAID',
        items: {
          create: [
            {
              productId: (await prisma.product.findFirst({
                where: { name: 'Sony WH-1000XM5 无线降噪耳机' },
              }))!.id,
              quantity: 1,
              price: 2499.0,
            },
            {
              productId: (await prisma.product.findFirst({
                where: { name: '不锈钢保温杯 500ml' },
              }))!.id,
              quantity: 1,
              price: 89.9,
            },
            {
              productId: (await prisma.product.findFirst({
                where: { name: '纯棉复古水洗牛仔裤' },
              }))!.id,
              quantity: 1,
              price: 399.5,
            },
          ],
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        userId: regularUser.id,
        total: 128.0,
        status: 'SHIPPED',
        items: {
          create: [
            {
              productId: (await prisma.product.findFirst({
                where: { name: '北欧极简陶瓷花瓶' },
              }))!.id,
              quantity: 1,
              price: 128.0,
            },
          ],
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(`创建了订单: ${order1.id} (状态: ${order1.status})`);
    console.log(`创建了订单: ${order2.id} (状态: ${order2.status})`);

    console.log(`数据播种完成！`);
  } catch (e) {
    console.error('播种过程中出错:', e);
    throw e;
  } finally {
    await prisma.$disconnect();
    console.log('数据库连接已断开。');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('未处理的错误:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
