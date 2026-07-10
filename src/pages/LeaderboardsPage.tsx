import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';

export default function LeaderboardsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading title="Leaderboards" subtitle="Coming soon" />
        <div className="mt-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white">Leaderboards — Coming Soon</h2>
            <p className="mt-2 text-sm text-[#8D95A8]">We're building a smart leaderboard experience. Check back soon.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
