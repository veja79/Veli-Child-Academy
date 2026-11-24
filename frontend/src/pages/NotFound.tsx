import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

export default function NotFound() {
  return (
    <PageHero title="Page not found">
      That page doesn't exist. <Link to="/">Go back home</Link>
    </PageHero>
  );
}
