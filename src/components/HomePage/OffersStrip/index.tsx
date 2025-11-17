'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface Offer {
	id: string;
	title: string;
	titleAr: string;
	discount: string;
	discountAr: string;
	link?: string;
}

const OFFERS: Offer[] = [
	{
		id: '1',
		title: 'Free Delivery',
		titleAr: 'توصيل مجاني',
		discount: 'Orders over 100 SAR',
		discountAr: 'للطلبات فوق 100 ريال',
		link: '/home',
	},
	{
		id: '2',
		title: 'Save 25% Off',
		titleAr: 'وفر 25%',
		discount: 'First 3 Orders',
		discountAr: 'أول 3 طلبات',
		link: '/home',
	},
	{
		id: '3',
		title: 'Fast Delivery',
		titleAr: 'توصيل سريع',
		discount: 'Under 30 Minutes',
		discountAr: 'أقل من 30 دقيقة',
		link: '/home',
	},
	{
		id: '4',
		title: 'Exclusive Deals',
		titleAr: 'عروض حصرية',
		discount: 'Premium Members',
		discountAr: 'للأعضاء المميزين',
		link: '/home',
	},
	{
		id: '5',
		title: 'Happy Hour',
		titleAr: 'ساعة سعيدة',
		discount: '3 PM - 6 PM Daily',
		discountAr: '3 م - 6 م يومياً',
		link: '/home',
	},
	{
		id: '6',
		title: 'Loyalty Points',
		titleAr: 'نقاط الولاء',
		discount: 'Earn on Every Order',
		discountAr: 'اكسب مع كل طلب',
		link: '/home',
	},
	{
		id: '7',
		title: 'Weekend Special',
		titleAr: 'عرض نهاية الأسبوع',
		discount: 'Up to 40% Off',
		discountAr: 'خصم حتى 40%',
		link: '/home',
	},
	{
		id: '8',
		title: 'New User Bonus',
		titleAr: 'مكافأة العضو الجديد',
		discount: '50 SAR Credit',
		discountAr: 'رصيد 50 ريال',
		link: '/register',
	},
];

// Duplicate offers for seamless infinite loop
const DUPLICATED_OFFERS = [...OFFERS, ...OFFERS, ...OFFERS, ...OFFERS];

export default function OffersStrip() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const router = useRouter();

	const handleOfferClick = (offer: Offer) => {
		if (offer.link) {
			router.push(offer.link);
		}
	};

	return (
		<section className="my-6 sm:my-8 border-y border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" dir={isArabic ? 'rtl' : 'ltr'}>
			<div className="overflow-hidden py-4">
				<div className="hover-pause inline-flex">
					<div
						className={`flex gap-6 sm:gap-8 ${isArabic ? 'animate-marquee-rtl' : 'animate-marquee-ltr'}`}
						style={{
							display: 'inline-flex',
						}}
					>
						{DUPLICATED_OFFERS.map((offer, index) => {
							const displayTitle = isArabic ? offer.titleAr : offer.title;
							const displayDiscount = isArabic ? offer.discountAr : offer.discount;

							return (
								<div
									key={`${offer.id}-${index}`}
									onClick={() => handleOfferClick(offer)}
									className={`
										flex-shrink-0 flex items-center gap-3 sm:gap-4
										px-4 sm:px-5 py-2 sm:py-2.5
										rounded-lg
										bg-white dark:bg-gray-800
										border border-gray-200 dark:border-gray-700
										text-gray-900 dark:text-gray-100
										shadow-sm hover:shadow-md
										cursor-pointer
										transition-all duration-200
										hover:border-gray-300 dark:hover:border-gray-600
										whitespace-nowrap
										group
									`}
								>
									{/* Content */}
									<div className="flex items-center gap-2 sm:gap-3">
										<h3 className="font-semibold text-sm sm:text-base">
											{displayTitle}
										</h3>
										<span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
											•
										</span>
										<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
											{displayDiscount}
										</p>
									</div>

									{/* Arrow */}
									<ArrowRight
										className={`
											flex-shrink-0 w-4 h-4 sm:w-4 sm:h-4
											text-gray-400 dark:text-gray-500
											group-hover:text-gray-600 dark:group-hover:text-gray-300
											transition-all
											group-hover:translate-x-0.5
											${isArabic ? 'rotate-180' : ''}
										`}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}

