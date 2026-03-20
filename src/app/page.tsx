import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">欢迎使用 Shadcn UI + Tailwind v4</h1>
      
      {/* 使用主色按钮 */}
      <Button className="mr-4">
        主要操作
      </Button>

      {/* 使用次要风格按钮 */}
      <Button variant="secondary">
        次要操作
      </Button>
      
      {/* 使用带图标的按钮 (需先安装 lucide-react，如果还没装) */}
      {/* <Button variant="outline">
        <ShoppingCart className="mr-2 h-4 w-4" /> 购物车
      </Button> */}
    </main>
  );
}