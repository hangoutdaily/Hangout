import WishlistGrid from '@/components/ui/WishlistGrid';

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 md:px-6 pt-8 pb-2">
        <h1 className="text-2xl font-medium tracking-tight">My Hangouts</h1>
      </div>
      <section className="pt-2 pb-20 md:pb-10">
        <WishlistGrid />
      </section>
    </div>
  );
}
