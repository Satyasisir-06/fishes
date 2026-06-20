import TrackClient from "@/components/track/TrackClient";

export const metadata = {
  title: "Track Order | Kicchu",
  description: "Track your order status",
};

export default function TrackPage() {
  return (
    <div className="flex-1 bg-primary pt-20 pb-28">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-extrabold text-foreground mb-4">Track Order</h1>
        <p className="text-muted mb-8">Enter your unique pickup code and phone number to see the current status of your order.</p>
        
        <TrackClient />
      </div>
    </div>
  );
}
