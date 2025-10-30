import EventGrid from "@/components/ui/EventGrid";
import CategoryFilters from "@/components/ui/CategoryFilters";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-background">
      <CategoryFilters />
      <EventGrid />
    </div>
  );
}
