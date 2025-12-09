import WishlistGrid from '@/components/ui/WishlistGrid';

export default function WishlistPage() {
  return (
    <div className="font-sans min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 mt-10 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          My Wishlist
        </h1>
        <p className="text-muted-foreground mt-1">Hangouts you&apos;ve saved for later.</p>
      </div>
      <section className="pt-2 pb-20 md:pb-10">
        <WishlistGrid />
      </section>
    </div>
  );
}
