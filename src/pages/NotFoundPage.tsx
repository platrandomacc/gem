import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-2xl text-center">
      <p className="text-sm uppercase tracking-[0.32em] text-[#3B82F6]">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">The route you requested is not available.</h1>
      <p className="mt-3 text-sm leading-7 text-[#8D95A8]">This section may have moved. Head back to the main lobby to continue exploring the experience.</p>
      <Link to="/" className="mt-6 inline-flex">
        <Button>
          <ArrowLeft size={16} className="mr-2" />
          Return home
        </Button>
      </Link>
    </Card>
  );
}
