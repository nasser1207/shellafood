import PopularStoresPage from '@/components/HomePage/PopularStores/PopularStoresPage';
import { TEST_STORES } from '@/lib/data/categories/testData';

export default function PopularStoresRoute() {
    return <PopularStoresPage stores={TEST_STORES} />;
}

