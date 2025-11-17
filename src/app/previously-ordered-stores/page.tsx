import PreviouslyOrderedStoresPage from '@/components/HomePage/PreviouslyOrderedStores/PreviouslyOrderedStoresPage';
import { TEST_STORES } from '@/lib/data/categories/testData';

export default function PreviouslyOrderedStoresRoute() {
    return <PreviouslyOrderedStoresPage stores={TEST_STORES} />;
}

