import CategoryFilters from '@/components/ui/CategoryFilters';
import EventGrid from '@/components/ui/EventGrid';

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-background">
      <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
        <CategoryFilters />
      </section>
      <section className="pt-2 pb-20 md:pb-10">
        <EventGrid />
      </section>
    </div>
  );
}
