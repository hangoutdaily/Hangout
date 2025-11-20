import EventDetailClient from './components/EventDetailClient';

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <EventDetailClient id={id} />;
}
