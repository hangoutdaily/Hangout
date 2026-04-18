import WishlistGrid from '@/components/ui/WishlistGrid';

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-2">
        <h1 className="text-2xl font-medium tracking-tight">My Hangouts</h1>
      </div>
      <section className="pt-2 pb-20 md:pb-10">
        <WishlistGrid />
      </section>
    </div>
  );
}
