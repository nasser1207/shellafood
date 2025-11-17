import { TEST_STORES } from '@/lib/data/categories/testData';
import { Store } from '@/components/Utils/StoreCard';
import NearbyStoresPage from '@/components/HomePage/NearbyStores/NearbyStoresPage';

export default async function NearbyStoresRoute() {
	// Get all stores (in real app, filter by user location)
	const stores = TEST_STORES as Store[];

	return <NearbyStoresPage stores={stores} />;
}

