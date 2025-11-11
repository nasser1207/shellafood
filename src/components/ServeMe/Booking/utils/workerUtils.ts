/**
 * Worker Utilities
 * Helper functions for worker-related operations
 */

export interface RecommendedWorker {
	id: string;
	name: string;
	nameAr: string;
	avatar: string;
	rating: number;
	reviewsCount: number;
	price: number;
	experience: string;
	experienceAr: string;
	location: string;
	specialization: string;
	specializationAr: string;
	distance: number;
}

/**
 * Mock function to find the best worker based on proximity, rating, and specialization
 * In production, this would be an API call
 */
export const findBestWorker = async (): Promise<RecommendedWorker> => {
	// Simulate API call delay
	await new Promise((resolve) => setTimeout(resolve, 2000));

	// Mock workers data - in real app, this would come from API
	const mockWorkers: RecommendedWorker[] = [
		{
			id: "1",
			name: "Ahmed Mohammed",
			nameAr: "أحمد محمد",
			avatar: "/worker1.jpg",
			rating: 4.9,
			reviewsCount: 203,
			price: 280,
			experience: "8 years",
			experienceAr: "8 سنوات",
			location: "Riyadh",
			specialization: "Electrical & Plumbing",
			specializationAr: "كهرباء وسباكة",
			distance: 2.5,
		},
		{
			id: "2",
			name: "Fatima Ali",
			nameAr: "فاطمة علي",
			avatar: "/worker2.jpg",
			rating: 4.8,
			reviewsCount: 156,
			price: 300,
			experience: "6 years",
			experienceAr: "6 سنوات",
			location: "Riyadh",
			specialization: "HVAC & Maintenance",
			specializationAr: "تكييف وصيانة",
			distance: 3.2,
		},
		{
			id: "3",
			name: "Khalid Al-Saad",
			nameAr: "خالد السعد",
			avatar: "/worker1.jpg",
			rating: 4.7,
			reviewsCount: 189,
			price: 250,
			experience: "10 years",
			experienceAr: "10 سنوات",
			location: "Riyadh",
			specialization: "General Repairs",
			specializationAr: "إصلاحات عامة",
			distance: 1.8,
		},
	];

	// Find best worker based on: rating (40%), distance (30%), specialization match (30%)
	const bestWorker = mockWorkers.reduce((best, current) => {
		const currentScore = current.rating * 0.4 + (10 - current.distance) * 0.3 + 5 * 0.3;
		const bestScore = best.rating * 0.4 + (10 - best.distance) * 0.3 + 5 * 0.3;
		return currentScore > bestScore ? current : best;
	});

	return bestWorker;
};

/**
 * Storage keys for session management
 */
export const STORAGE_KEYS = {
	RECOMMENDED_WORKER: "recommendedWorker",
} as const;

