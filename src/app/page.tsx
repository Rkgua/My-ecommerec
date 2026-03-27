import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex-1">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-serif text-xl tracking-wide">商店</h1>
          <nav className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              首页
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              商品
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              关于
            </a>
          </nav>
          <Button variant="outline" size="sm">
            购物车
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-5xl leading-tight mb-6">
              简约之美
              <br />
              秩序之美
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed max-w-md">
              专注于内容本身，追求清晰的视觉层次与阅读体验。
              每一件商品，都经过精心挑选。
            </p>
            <div className="flex gap-4">
              <Button className="bg-foreground text-background hover:bg-foreground/90">
                浏览商品
              </Button>
              <Button variant="outline">了解更多</Button>
            </div>
          </div>
          <div className="aspect-square bg-muted border border-border p-8">
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="font-serif text-muted-foreground text-2xl">
                商品图片
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h3 className="font-serif text-3xl">精选商品</h3>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground"
            >
              查看全部
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-card p-6 hover:bg-secondary/30 transition-colors"
              >
                <div className="aspect-square bg-muted mb-6">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">商品 {item}</span>
                  </div>
                </div>
                <h4 className="font-medium mb-2">商品名称 {item}</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  简洁的商品描述
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-serif">¥299</span>
                  <Button variant="outline" size="sm">
                    加入购物车
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="border border-border p-8">
              <h4 className="font-serif text-xl mb-4">精选品质</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                每一件商品都经过严格筛选，确保品质与设计并重。
              </p>
            </div>
            <div className="border border-border p-8">
              <h4 className="font-serif text-xl mb-4">简洁包装</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                去除繁复装饰，专注于产品本身，环保且精致。
              </p>
            </div>
            <div className="border border-border p-8">
              <h4 className="font-serif text-xl mb-4">用心服务</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                随时为您解答疑问，提供贴心的购物体验。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 商店. 保留所有权利。</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">
                隐私政策
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                服务条款
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
