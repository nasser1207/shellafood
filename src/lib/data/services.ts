import { Wrench, Zap, Droplet, Wind, Hammer, Paintbrush, Sparkles, Shield, CircleDot } from "lucide-react";
import React from "react";

/**
 * Service Types Configuration
 * New Structure:
 * - ServiceCategoryData: Main service categories (e.g., "Legal Services", "Home Maintenance")
 * - IndividualServiceData: Individual services within a category (e.g., "Legal Consultation")
 */

// Individual Service (the deepest nested level)
export interface IndividualServiceData {
	slug: string;
	titleAr: string;
	titleEn: string;
	descriptionAr: string;
	descriptionEn: string;
	heroImage: string;
	priceStartsFrom: number; // Price in SAR
	rating: number;
	reviewsCount: number;
	features: {
		ar: Array<{ text: string; included: boolean }>;
		en: Array<{ text: string; included: boolean }>;
	};
	serviceDetails: {
		ar: Array<{ text: string }>;
		en: Array<{ text: string }>;
	};
}

// Service Category (parent level)
export interface ServiceCategoryData {
	slug: string; // URL-friendly identifier
	titleAr: string;
	titleEn: string;
	descriptionAr: string;
	descriptionEn: string;
	heroImage: string; // Main hero image
	videoThumbnail: string; // Video section thumbnail
	mainServices: {
		ar: Array<{ slug: string; title: string; image: string; path: string }>;
		en: Array<{ slug: string; title: string; image: string; path: string }>;
	};
	keyServices: {
		ar: Array<{ slug: string; title: string; image: string;path: string, icon: React.ReactNode }>;
		en: Array<{ slug: string; title: string; image: string;path: string, icon: React.ReactNode }>;
	};
	whyChooseUs: {
		ar: Array<{ title: string; description: string; icon: React.ReactNode }>;
		en: Array<{ title: string; description: string; icon: React.ReactNode }>;
	};
	availableWorkshops: {
		ar: Array<{ 
			name: string; 
			image: string; 
			rating: number; 
			distance: string; 
			availableHours: string;
		}>;
		en: Array<{ 
			name: string; 
			image: string; 
			rating: number; 
			distance: string; 
			availableHours: string;
		}>;
	};
}

export const serviceCategoriesData: Record<string, ServiceCategoryData> = {
	"home-maintenance": {
		slug: "home-maintenance",
		titleAr: "خدمات الصيانة المنزلية المتكاملة",
		titleEn: "Complete Home Maintenance Services",
		descriptionAr: "حلول احترافية لجميع احتياجاتك",
		descriptionEn: "Professional solutions for all your needs",
		heroImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=800&fit=crop",
		videoThumbnail: "https://images.unsplash.com/photo-1621905251918-48116d8b6d82?w=1200&h=800&fit=crop",
		mainServices: {
			ar: [
				{ slug: "pest-control", title: "مكافحة الحشرات", image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/pest-control" },
				{ slug: "electrical-services", title: "خدمات الكهرباء", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/electrical-services" },
				{ slug: "plumbing-services", title: "خدمات السباكة", image: "https://images.unsplash.com/photo-1621905252472-6af3f59fd39e?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/plumbing-services" },
				{ slug: "home-cleaning", title: "تنظيف المنازل والحدائق", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/home-cleaning" },
				{ slug: "ac-maintenance", title: "اصلاح وصيانة المكيفات", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/ac-maintenance" },
			
				{ slug: "carpentry-services", title: "خدمات النجارة", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/carpentry-services" },
		
			],
			en: [
				{ slug: "pest-control", title: "Pest Control", image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/pest-control"		 },
				{ slug: "electrical-services", title: "Electrical Services", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/electrical-services" },
				{ slug: "plumbing-services", title: "Plumbing Services", image: "https://images.unsplash.com/photo-1621905252472-6af3f59fd39e?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/plumbing-services" },
				{ slug: "home-cleaning", title: "Home and Garden Cleaning", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/home-cleaning" },
				{ slug: "ac-maintenance", title: "AC Repair and Maintenance", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/ac-maintenance" },
				{ slug: "carpentry-services", title: "Carpentry Services", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/carpentry-services" },
			],
		},
		keyServices: {
			ar: [
				{ slug: "water-tank-cleaning", title: "تنظيف خزانات المياه", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/water-tank-cleaning", icon: React.createElement(Droplet, { className: "w-8 h-8" }) },
				{ slug: "indoor-cleaning", title: "تنظيف وفحص الوحدة الداخلية", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/indoor-cleaning", icon: React.createElement(Wind, { className: "w-8 h-8" }) },
				{ slug: "tank-maintenance", title: "صيانة وتنظيف خزانات المياه", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/tank-maintenance", icon: React.createElement(Sparkles, { className: "w-8 h-8" }) },
			],
			en: [
				{ slug: "water-tank-cleaning", title: "Water Tank Cleaning", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/water-tank-cleaning", icon: React.createElement(Droplet, { className: "w-8 h-8" }) },
				{ slug: "indoor-cleaning", title: "Indoor Unit Cleaning and Inspection", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/indoor-cleaning", icon: React.createElement(Wind, { className: "w-8 h-8" }) },
				{ slug: "tank-maintenance", title: "Water Tank Maintenance and Cleaning", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop", path: "/serve-me/home-maintenance/tank-maintenance", icon: React.createElement(Sparkles, { className: "w-8 h-8" }) },
			],
		},
		whyChooseUs: {
			ar: [
				{ title: "ضمان الجودة", description: "نضمن جودة عالية في جميع خدماتنا", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "خدمة 24/24", description: "متوفرون على مدار الساعة", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "خبرة متخصصة", description: "فريق من الخبراء المحترفين", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
			en: [
				{ title: "Quality Guarantee", description: "We guarantee high quality in all our services", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "24/7 Service", description: "Available around the clock", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "Specialized Expertise", description: "Team of professional experts", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
		},
		availableWorkshops: {
			ar: [
				{ 
					name: "ورشة المحترف", 
					image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", 
					rating: 4.7, 
					distance: "2.5 كم", 
					availableHours: "متاح اليوم من: 9 ص - 6 م"
				},
				{ 
					name: "ورشة الخبراء", 
					image: "https://images.unsplash.com/photo-1621905251918-48116d8b6d82?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "3.2 كم", 
					availableHours: "متاح اليوم من: 8 ص - 7 م"
				},
			],
			en: [
				{ 
					name: "Professional Workshop", 
					image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", 
					rating: 4.7, 
					distance: "2.5 km", 
					availableHours: "Available today: 9 AM - 6 PM"
				},
				{ 
					name: "Experts Workshop", 
					image: "https://images.unsplash.com/photo-1621905251918-48116d8b6d82?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "3.2 km", 
					availableHours: "Available today: 8 AM - 7 PM"
				},
			],
		},
	},
	"car-maintenance": {
		slug: "car-maintenance",
		titleAr: "خدمات صيانة السيارات المتكاملة",
		titleEn: "Complete Car Maintenance Services",
		descriptionAr: "صيانة وإصلاح احترافية لسيارتك",
		descriptionEn: "Professional maintenance and repair for your car",
		heroImage: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=1200&h=800&fit=crop",
		videoThumbnail: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=800&fit=crop",
		mainServices: {
			ar: [
				{ slug: "comprehensive-inspection", title: "فحص شامل", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/comprehensive-inspection" },
				{ slug: "oil-change", title: "تغيير الزيوت", image: "https://images.unsplash.com/photo-1633158829589-9d44e0e1d844?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/oil-change" },
				{ slug: "brake-inspection", title: "فحص الفرامل", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/brake-inspection" },
				{ slug: "engine-maintenance", title: "صيانة المحرك", image: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/engine-maintenance" },
				{ slug: "tire-inspection", title: "فحص الإطارات", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/tire-inspection" },
				{ slug: "ac-maintenance-car", title: "صيانة التكييف", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/ac-maintenance" },
			],
			en: [
				{ slug: "comprehensive-inspection", title: "Comprehensive Inspection", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/comprehensive-inspection" },
				{ slug: "oil-change", title: "Oil Change", image: "https://images.unsplash.com/photo-1633158829589-9d44e0e1d844?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/oil-change" },
				{ slug: "brake-inspection", title: "Brake Inspection", image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/brake-inspection" },
				{ slug: "engine-maintenance", title: "Engine Maintenance", image: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/engine-maintenance" },
				{ slug: "tire-inspection", title: "Tire Inspection", image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/tire-inspection" },
				{ slug: "ac-maintenance-car", title: "AC Maintenance", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/ac-maintenance" },
			],
		},
		keyServices: {
			ar: [
				{ slug: "periodic-maintenance", title: "صيانة دورية", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/periodic-maintenance", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "breakdown-repair", title: "إصلاح الأعطال", image: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/breakdown-repair", icon: React.createElement(Hammer, { className: "w-8 h-8" }) },
				{ slug: "electrical-inspection-car", title: "فحص كهربائي", image: "https://images.unsplash.com/photo-1621905251918-48116d8b6d82?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/electrical-inspection", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
			],
			en: [
				{ slug: "periodic-maintenance", title: "Periodic Maintenance", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/periodic-maintenance", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "breakdown-repair", title: "Breakdown Repair", image: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/breakdown-repair", icon: React.createElement(Hammer, { className: "w-8 h-8" }) },
				{ slug: "electrical-inspection-car", title: "Electrical Inspection", image: "https://images.unsplash.com/photo-1621905251918-48116d8b6d82?w=600&h=400&fit=crop", path: "/serve-me/car-maintenance/electrical-inspection", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
			],
		},
		whyChooseUs: {
			ar: [
				{ title: "فنيون معتمدون", description: "فريق من الفنيين المعتمدين والمحترفين", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "خدمة سريعة", description: "إنجاز العمل في الوقت المحدد", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "ضمان الخدمة", description: "ضمان على جميع أعمال الصيانة", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
			en: [
				{ title: "Certified Technicians", description: "Team of certified professional technicians", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "Fast Service", description: "Work completed on time", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "Service Warranty", description: "Warranty on all maintenance work", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
		},
		availableWorkshops: {
			ar: [
				{ 
					name: "ورشة السيارات المتقدمة", 
					image: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=600&h=400&fit=crop", 
					rating: 4.9, 
					distance: "1.8 كم", 
					availableHours: "متاح اليوم من: 8 ص - 8 م"
				},
				{ 
					name: "مركز الصيانة السريع", 
					image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", 
					rating: 4.6, 
					distance: "2.3 كم", 
					availableHours: "متاح اليوم من: 9 ص - 7 م"
				},
			],
			en: [
				{ 
					name: "Advanced Auto Workshop", 
					image: "https://images.unsplash.com/photo-1633158829875-7a508d44dcd8?w=600&h=400&fit=crop", 
					rating: 4.9, 
					distance: "1.8 km", 
					availableHours: "Available today: 8 AM - 8 PM"
				},
				{ 
					name: "Quick Service Center", 
					image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop", 
					rating: 4.6, 
					distance: "2.3 km", 
					availableHours: "Available today: 9 AM - 7 PM"
				},
			],
		},
	},
	"teachers-training": {
		slug: "teachers-training",
		titleAr: "خدمات المعلمون والتدريب",
		titleEn: "Teachers and Training Services",
		descriptionAr: "تعليم وتدريب احترافي في جميع المجالات",
		descriptionEn: "Professional education and training in all fields",
		heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop",
		videoThumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop",
		mainServices: {
			ar: [
				{ slug: "private-tutoring", title: "دروس خصوصية", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/private-tutoring" },
				{ slug: "professional-training", title: "تدريب مهني", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/professional-training" },
				{ slug: "language-learning", title: "تعليم اللغات", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/language-learning" },
				{ slug: "development-courses", title: "دورات تطوير", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/development-courses" },
				{ slug: "sports-training", title: "تدريب رياضي", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/sports-training" },
				{ slug: "computer-education", title: "تعليم الحاسوب", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/computer-education" },
			],
			en: [
				{ slug: "private-tutoring", title: "Private Tutoring", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/private-tutoring" },
				{ slug: "professional-training", title: "Professional Training", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/professional-training" },
				{ slug: "language-learning", title: "Language Learning", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/language-learning" },
				{ slug: "development-courses", title: "Development Courses", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/development-courses" },
				{ slug: "sports-training", title: "Sports Training", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/sports-training" },
				{ slug: "computer-education", title: "Computer Education", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/computer-education" },
			],
		},
		keyServices: {
			ar: [
				{ slug: "individual-learning", title: "تعليم فردي", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/individual-learning", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "intensive-courses", title: "دورات مكثفة", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/intensive-courses", icon: React.createElement(Hammer, { className: "w-8 h-8" }) },
				{ slug: "practical-training", title: "تدريب عملي", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/practical-training", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
			],
			en: [
				{ slug: "individual-learning", title: "Individual Learning", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/individual-learning", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "intensive-courses", title: "Intensive Courses", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/intensive-courses", icon: React.createElement(Hammer, { className: "w-8 h-8" }) },
				{ slug: "practical-training", title: "Practical Training", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop", path: "/serve-me/teachers-training/practical-training", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
			],
		},
		whyChooseUs: {
			ar: [
				{ title: "معلمون خبراء", description: "معلمون ذوو خبرة عالية", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "جداول مرنة", description: "مواعيد تناسب احتياجاتك", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "نتائج مضمونة", description: "تحسين ملحوظ في الأداء", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
			en: [
				{ title: "Expert Teachers", description: "Highly experienced teachers", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "Flexible Schedules", description: "Timings that suit your needs", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "Guaranteed Results", description: "Noticeable performance improvement", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
		},
		availableWorkshops: {
			ar: [
				{ 
					name: "مركز التدريب المتميز", 
					image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "1.5 كم", 
					availableHours: "متاح اليوم من: 10 ص - 8 م"
				},
				{ 
					name: "أكاديمية المحترفين", 
					image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", 
					rating: 4.9, 
					distance: "2.1 كم", 
					availableHours: "متاح اليوم من: 9 ص - 9 م"
				},
			],
			en: [
				{ 
					name: "Excellence Training Center", 
					image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "1.5 km", 
					availableHours: "Available today: 10 AM - 8 PM"
				},
				{ 
					name: "Professionals Academy", 
					image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", 
					rating: 4.9, 
					distance: "2.1 km", 
					availableHours: "Available today: 9 AM - 9 PM"
				},
			],
		},
	},
	"travel-yemen": {
		slug: "travel-yemen",
		titleAr: "خدمات السفر من اليمن",
		titleEn: "Travel Services from Yemen",
		descriptionAr: "خدمات سفر متكاملة وحجوزات موثوقة",
		descriptionEn: "Complete travel services and reliable bookings",
		heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=800&fit=crop",
		videoThumbnail: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1200&h=800&fit=crop",
		mainServices: {
			ar: [
				{ slug: "flight-booking", title: "حجز تذاكر الطيران", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/flight-booking" },
				{ slug: "hotel-reservations", title: "حجز الفنادق", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/hotel-reservations" },
				{ slug: "visa-processing", title: "استخراج التأشيرات", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/visa-processing" },
				{ slug: "tour-organization", title: "تنظيم الرحلات", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/tour-organization" },
				{ slug: "transportation-services", title: "خدمات النقل", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/transportation-services" },
				{ slug: "travel-insurance", title: "التأمين السياحي", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/travel-insurance" },
			],
			en: [
				{ slug: "flight-booking", title: "Flight Ticket Booking", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/flight-booking" },
				{ slug: "hotel-reservations", title: "Hotel Reservations", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/hotel-reservations" },
				{ slug: "visa-processing", title: "Visa Processing", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/visa-processing" },
				{ slug: "tour-organization", title: "Tour Organization", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/tour-organization" },
				{ slug: "transportation-services", title: "Transportation Services", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/transportation-services" },
				{ slug: "travel-insurance", title: "Travel Insurance", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/travel-insurance" },
			],
		},
		keyServices: {
			ar: [
				{ slug: "special-offers", title: "عروض مميزة", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/special-offers", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "support-24-7", title: "دعم على مدار الساعة", image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/support-24-7", icon: React.createElement(Hammer, { className: "w-8 h-8" }) },
				{ slug: "competitive-prices", title: "أسعار تنافسية", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/competitive-prices", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
			],
			en: [
				{ slug: "special-offers", title: "Special Offers", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/special-offers", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "support-24-7", title: "24/7 Support", image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/support-24-7", icon: React.createElement(Hammer, { className: "w-8 h-8" }) },
				{ slug: "competitive-prices", title: "Competitive Prices", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop", path: "/serve-me/travel-yemen/competitive-prices", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
			],
		},
		whyChooseUs: {
			ar: [
				{ title: "خبرة طويلة", description: "سنوات من الخبرة في مجال السفر", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "معاملات آمنة", description: "حماية كاملة لبياناتك", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "أفضل الأسعار", description: "عروض حصرية وأسعار مميزة", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
			en: [
				{ title: "Long Experience", description: "Years of experience in travel", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "Secure Transactions", description: "Complete protection for your data", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "Best Prices", description: "Exclusive offers and special prices", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
		},
		availableWorkshops: {
			ar: [
				{ 
					name: "وكالة السفر الذهبية", 
					image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop", 
					rating: 4.7, 
					distance: "3.0 كم", 
					availableHours: "متاح اليوم من: 9 ص - 6 م"
				},
				{ 
					name: "مركز الحجوزات السريع", 
					image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&h=400&fit=crop", 
					rating: 4.5, 
					distance: "1.9 كم", 
					availableHours: "متاح اليوم من: 10 ص - 7 م"
				},
			],
			en: [
				{ 
					name: "Golden Travel Agency", 
					image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop", 
					rating: 4.7, 
					distance: "3.0 km", 
					availableHours: "Available today: 9 AM - 6 PM"
				},
				{ 
					name: "Quick Reservations Center", 
					image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&h=400&fit=crop", 
					rating: 4.5, 
					distance: "1.9 km", 
					availableHours: "Available today: 10 AM - 7 PM"
				},
			],
		},
	},
	"babysitting": {
		slug: "babysitting",
		titleAr: "خدمة خذ ابني مع ابنك",
		titleEn: "Take My Child with You Service",
		descriptionAr: "رعاية أطفال موثوقة ومشاركة التوصيل",
		descriptionEn: "Reliable childcare and shared transportation",
		heroImage: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=800&fit=crop",
		videoThumbnail: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=800&fit=crop",
		mainServices: {
			ar: [
				{ slug: "school-transportation", title: "توصيل المدرسة", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop", path: "/serve-me/babysitting/school-transportation" },
				{ slug: "childcare", title: "رعاية الأطفال", image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop", path: "/serve-me/babysitting/childcare" },
				{ slug: "activity-sharing", title: "مشاركة الأنشطة", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop", path: "/serve-me/babysitting/activity-sharing" },
				{ slug: "safe-transportation", title: "التوصيل الآمن", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop", path: "/serve-me/babysitting/safe-transportation" },
				{ slug: "child-monitoring", title: "متابعة الأطفال", image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop", path: "/serve-me/babysitting/child-monitoring" },
				{ slug: "parent-coordination", title: "تنسيق مع الأهالي", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop", path: "/serve-me/babysitting/parent-coordination" },
			],
			en: [
				{ slug: "school-transportation", title: "School Transportation", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop", path: "/serve-me/babysitting/school-transportation" },
				{ slug: "childcare", title: "Childcare", image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop", path: "/serve-me/babysitting/childcare" },
				{ slug: "activity-sharing", title: "Activity Sharing", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop", path: "/serve-me/babysitting/activity-sharing" },
				{ slug: "safe-transportation", title: "Safe Transportation", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=400&fit=crop", path: "/serve-me/babysitting/safe-transportation" },
				{ slug: "child-monitoring", title: "Child Monitoring", image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop", path: "/serve-me/babysitting/child-monitoring" },
				{ slug: "parent-coordination", title: "Parent Coordination", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop", path: "/serve-me/babysitting/parent-coordination" },
			],
		},
		keyServices: {
			ar: [
				{ slug: "safety-trust", title: "أمان وثقة", image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop", path: "/serve-me/babysitting/safety-trust", icon: React.createElement(Shield, { className: "w-8 h-8" }) },
				{ slug: "cost-savings", title: "توفير التكاليف", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop", path: "/serve-me/babysitting/cost-savings", icon: React.createElement(Hammer, { className: "w-8 h-8" }) },
				{ slug: "continuous-monitoring", title: "مراقبة مستمرة", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop", path: "/serve-me/babysitting/continuous-monitoring", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
			],
			en: [
				{ slug: "safety-trust", title: "Safety and Trust", image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop", path: "/serve-me/babysitting/safety-trust", icon: React.createElement(Shield, { className: "w-8 h-8" }) },
				{ slug: "cost-savings", title: "Cost Savings", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop", path: "/serve-me/babysitting/cost-savings", icon: React.createElement(Hammer, { className: "w-8 h-8" }) },
				{ slug: "continuous-monitoring", title: "Continuous Monitoring", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop", path: "/serve-me/babysitting/continuous-monitoring", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
			],
		},
		whyChooseUs: {
			ar: [
				{ title: "راحة البال", description: "أطفالك في أيدٍ أمينة", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "توفير الوقت", description: "حل مثالي للأهالي المشغولين", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "تفاعل اجتماعي", description: "بناء صداقات للأطفال", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
			en: [
				{ title: "Peace of Mind", description: "Your children in safe hands", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "Time Saving", description: "Ideal solution for busy parents", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "Social Interaction", description: "Building friendships for children", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
		},
		availableWorkshops: {
			ar: [
				{ 
					name: "مركز رعاية الأطفال الآمن", 
					image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop", 
					rating: 4.9, 
					distance: "1.2 كم", 
					availableHours: "متاح اليوم من: 7 ص - 7 م"
				},
				{ 
					name: "خدمات التوصيل المشترك", 
					image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "0.8 كم", 
					availableHours: "متاح اليوم من: 6 ص - 8 م"
				},
			],
			en: [
				{ 
					name: "Safe Childcare Center", 
					image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop", 
					rating: 4.9, 
					distance: "1.2 km", 
					availableHours: "Available today: 7 AM - 7 PM"
				},
				{ 
					name: "Shared Transportation Services", 
					image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "0.8 km", 
					availableHours: "Available today: 6 AM - 8 PM"
				},
			],
		},
	},
	"legal-services": {
		slug: "legal-services",
		titleAr: "خدمات المعاملات القانونية",
		titleEn: "Legal Transaction Services",
		descriptionAr: "استشارات قانونية من محامين معتمدين",
		descriptionEn: "Legal consultations from certified lawyers",
		heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=800&fit=crop",
		videoThumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=800&fit=crop",
		mainServices: {
			ar: [
				{ slug: "legal-consultations", title: "استشارات قانونية", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop", path: "/serve-me/legal-services/legal-consultations" },
				{ slug: "contract-drafting", title: "صياغة العقود", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop", path: "/serve-me/legal-services/contract-drafting" },
				{ slug: "legal-representation", title: "التمثيل القانوني", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", path: "/serve-me/legal-services/legal-representation" },
				{ slug: "government-transactions", title: "المعاملات الحكومية", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop", path: "/serve-me/legal-services/government-transactions" },
				{ slug: "dispute-resolution", title: "حل النزاعات", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop", path: "/serve-me/legal-services/dispute-resolution" },
				{ slug: "real-estate-registration", title: "الشهر العقاري", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop", path: "/serve-me/legal-services/real-estate-registration" },
			],
			en: [
				{ slug: "legal-consultations", title: "Legal Consultations", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop", path: "/serve-me/legal-services/legal-consultations" },
				{ slug: "contract-drafting", title: "Contract Drafting", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop", path: "/serve-me/legal-services/contract-drafting" },
				{ slug: "legal-representation", title: "Legal Representation", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", path: "/serve-me/legal-services/legal-representation" },
				{ slug: "government-transactions", title: "Government Transactions", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop", path: "/serve-me/legal-services/government-transactions" },
				{ slug: "dispute-resolution", title: "Dispute Resolution", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop", path: "/serve-me/legal-services/dispute-resolution" },
				{ slug: "real-estate-registration", title: "Real Estate Registration", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop", path: "/serve-me/legal-services/real-estate-registration" },
			],
		},
		keyServices: {
			ar: [
				{ slug: "specialized-consultations", title: "استشارات متخصصة", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop", path: "/serve-me/legal-services/specialized-consultations", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "complete-confidentiality", title: "سرية تامة", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", path: "/serve-me/legal-services/complete-confidentiality", icon: React.createElement(Shield, { className: "w-8 h-8" }) },
				{ slug: "precise-follow-up", title: "متابعة دقيقة", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop", path: "/serve-me/legal-services/precise-follow-up", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
			],
			en: [
				{ slug: "specialized-consultations", title: "Specialized Consultations", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop", path: "/serve-me/legal-services/specialized-consultations", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "complete-confidentiality", title: "Complete Confidentiality", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", path: "/serve-me/legal-services/complete-confidentiality", icon: React.createElement(Shield, { className: "w-8 h-8" }) },
				{ slug: "precise-follow-up", title: "Precise Follow-up", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop", path: "/serve-me/legal-services/precise-follow-up", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
			],
		},
		whyChooseUs: {
			ar: [
				{ title: "محامون أكفاء", description: "فريق من المحامين المعتمدين", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "أسعار مناسبة", description: "أسعار تنافسية وعادلة", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "خبرة واسعة", description: "خبرة في مختلف المجالات القانونية", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
			en: [
				{ title: "Competent Lawyers", description: "Team of certified lawyers", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "Reasonable Prices", description: "Competitive and fair prices", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "Wide Experience", description: "Experience in various legal fields", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
		},
		availableWorkshops: {
			ar: [
				{ 
					name: "مكتب المحاماة المتخصص", 
					image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "2.7 كم", 
					availableHours: "متاح اليوم من: 9 ص - 5 م"
				},
				{ 
					name: "مركز الاستشارات القانونية", 
					image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", 
					rating: 4.7, 
					distance: "3.5 كم", 
					availableHours: "متاح اليوم من: 10 ص - 6 م"
				},
			],
			en: [
				{ 
					name: "Specialized Law Office", 
					image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "2.7 km", 
					availableHours: "Available today: 9 AM - 5 PM"
				},
				{ 
					name: "Legal Consultations Center", 
					image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", 
					rating: 4.7, 
					distance: "3.5 km", 
					availableHours: "Available today: 10 AM - 6 PM"
				},
			],
		},
	},
	"women-salons": {
		slug: "women-salons",
		titleAr: "خدمات الصالونات النسائية",
		titleEn: "Women's Salon Services",
		descriptionAr: "عناية بالجمال من خبيرات محترفات",
		descriptionEn: "Beauty care from professional experts",
		heroImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&h=800&fit=crop",
		videoThumbnail: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&h=800&fit=crop",
		mainServices: {
			ar: [
				{ slug: "hair-cutting-styling", title: "قص وتصفيف الشعر", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop", path: "/serve-me/women-salons/hair-cutting-styling" },
				{ slug: "hair-coloring", title: "صبغ الشعر", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", path: "/serve-me/women-salons/hair-coloring" },
				{ slug: "skin-care", title: "عناية بالبشرة", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d5de?w=600&h=400&fit=crop", path: "/serve-me/women-salons/skin-care" },
				{ slug: "makeup-events", title: "مكياج ومناسبات", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=400&fit=crop", path: "/serve-me/women-salons/makeup-events" },
				{ slug: "nail-care", title: "عناية بالأظافر", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop", path: "/serve-me/women-salons/nail-care" },
				{ slug: "hair-treatment", title: "علاج الشعر", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", path: "/serve-me/women-salons/hair-treatment" },
			],
			en: [
				{ slug: "hair-cutting-styling", title: "Hair Cutting and Styling", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop", path: "/serve-me/women-salons/hair-cutting-styling" },
				{ slug: "hair-coloring", title: "Hair Coloring", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", path: "/serve-me/women-salons/hair-coloring" },
				{ slug: "skin-care", title: "Skin Care", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d5de?w=600&h=400&fit=crop", path: "/serve-me/women-salons/skin-care" },
				{ slug: "makeup-events", title: "Makeup and Events", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=400&fit=crop", path: "/serve-me/women-salons/makeup-events" },
				{ slug: "nail-care", title: "Nail Care", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop", path: "/serve-me/women-salons/nail-care" },
				{ slug: "hair-treatment", title: "Hair Treatment", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", path: "/serve-me/women-salons/hair-treatment" },
			],
		},
		keyServices: {
			ar: [
				{ slug: "beauty-experts", title: "خبيرات تجميل", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop", path: "/serve-me/women-salons/beauty-experts", icon: React.createElement(Sparkles, { className: "w-8 h-8" }) },
				{ slug: "original-products", title: "منتجات أصلية", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d5de?w=600&h=400&fit=crop", path: "/serve-me/women-salons/original-products", icon: React.createElement(Shield, { className: "w-8 h-8" }) },
				{ slug: "elegant-atmosphere", title: "أجواء راقية", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", path: "/serve-me/women-salons/elegant-atmosphere", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
			],
			en: [
				{ slug: "beauty-experts", title: "Beauty Experts", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop", path: "/serve-me/women-salons/beauty-experts", icon: React.createElement(Sparkles, { className: "w-8 h-8" }) },
				{ slug: "original-products", title: "Original Products", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d5de?w=600&h=400&fit=crop", path: "/serve-me/women-salons/original-products", icon: React.createElement(Shield, { className: "w-8 h-8" }) },
				{ slug: "elegant-atmosphere", title: "Elegant Atmosphere", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", path: "/serve-me/women-salons/elegant-atmosphere", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
			],
		},
		whyChooseUs: {
			ar: [
				{ title: "خبيرات محترفات", description: "فريق من خبيرات التجميل", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "منتجات عالمية", description: "استخدام أفضل المنتجات", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "خصوصية تامة", description: "بيئة مريحة وخاصة", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
			en: [
				{ title: "Professional Experts", description: "Team of beauty experts", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "International Products", description: "Using the best products", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "Complete Privacy", description: "Comfortable and private environment", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
		},
		availableWorkshops: {
			ar: [
				{ 
					name: "صالون الجمال المتميز", 
					image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop", 
					rating: 4.9, 
					distance: "1.3 كم", 
					availableHours: "متاح اليوم من: 9 ص - 9 م"
				},
				{ 
					name: "مركز العناية بالجمال", 
					image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "2.4 كم", 
					availableHours: "متاح اليوم من: 10 ص - 8 م"
				},
			],
			en: [
				{ 
					name: "Excellence Beauty Salon", 
					image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop", 
					rating: 4.9, 
					distance: "1.3 km", 
					availableHours: "Available today: 9 AM - 9 PM"
				},
				{ 
					name: "Beauty Care Center", 
					image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "2.4 km", 
					availableHours: "Available today: 10 AM - 8 PM"
				},
			],
		},
	},
	"men-salons": {
		slug: "men-salons",
		titleAr: "خدمات الصالونات الرجالية",
		titleEn: "Men's Salon Services",
		descriptionAr: "عناية رجالية متميزة من حلاقين محترفين",
		descriptionEn: "Premium men's care from professional barbers",
		heroImage: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&h=800&fit=crop",
		videoThumbnail: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&h=800&fit=crop",
		mainServices: {
			ar: [
				{ slug: "modern-haircuts", title: "قص شعر عصري", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop", path: "/serve-me/men-salons/modern-haircuts" },
				{ slug: "beard-shaving", title: "حلاقة ذقن", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", path: "/serve-me/men-salons/beard-shaving" },
				{ slug: "styling-grooming", title: "تصفيف وتنسيق", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", path: "/serve-me/men-salons/styling-grooming" },
				{ slug: "beard-care", title: "عناية باللحية", image: "https://images.unsplash.com/photo-1622293296315-8e4eb54aae26?w=600&h=400&fit=crop", path: "/serve-me/men-salons/beard-care" },
				{ slug: "masks-treatments", title: "ماسكات وعلاجات", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d5de?w=600&h=400&fit=crop", path: "/serve-me/men-salons/masks-treatments" },
				{ slug: "hair-coloring-men", title: "تلوين الشعر", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", path: "/serve-me/men-salons/hair-coloring" },
			],
			en: [
				{ slug: "modern-haircuts", title: "Modern Haircuts", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop", path: "/serve-me/men-salons/modern-haircuts" },
				{ slug: "beard-shaving", title: "Beard Shaving", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", path: "/serve-me/men-salons/beard-shaving" },
				{ slug: "styling-grooming", title: "Styling and Grooming", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", path: "/serve-me/men-salons/styling-grooming" },
				{ slug: "beard-care", title: "Beard Care", image: "https://images.unsplash.com/photo-1622293296315-8e4eb54aae26?w=600&h=400&fit=crop", path: "/serve-me/men-salons/beard-care" },
				{ slug: "masks-treatments", title: "Masks and Treatments", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d5de?w=600&h=400&fit=crop", path: "/serve-me/men-salons/masks-treatments" },
				{ slug: "hair-coloring-men", title: "Hair Coloring", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", path: "/serve-me/men-salons/hair-coloring" },
			],
		},
		keyServices: {
			ar: [
				{ slug: "expert-barbers", title: "حلاقون خبراء", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop", path: "/serve-me/men-salons/expert-barbers", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "modern-techniques", title: "تقنيات حديثة", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", path: "/serve-me/men-salons/modern-techniques", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
				{ slug: "original-products-men", title: "منتجات أصلية", image: "https://images.unsplash.com/photo-1622293296315-8e4eb54aae26?w=600&h=400&fit=crop", path: "/serve-me/men-salons/original-products", icon: React.createElement(Shield, { className: "w-8 h-8" }) },
			],
			en: [
				{ slug: "expert-barbers", title: "Expert Barbers", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop", path: "/serve-me/men-salons/expert-barbers", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "modern-techniques", title: "Modern Techniques", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", path: "/serve-me/men-salons/modern-techniques", icon: React.createElement(Zap, { className: "w-8 h-8" }) },
				{ slug: "original-products-men", title: "Original Products", image: "https://images.unsplash.com/photo-1622293296315-8e4eb54aae26?w=600&h=400&fit=crop", path: "/serve-me/men-salons/original-products", icon: React.createElement(Shield, { className: "w-8 h-8" }) },
			],
		},
		whyChooseUs: {
			ar: [
				{ title: "حلاقون محترفون", description: "فريق من الحلاقين ذوي الخبرة", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "أجواء راقية", description: "صالون بتصميم عصري", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "خدمة سريعة", description: "خدمة فعالة دون انتظار طويل", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
			en: [
				{ title: "Professional Barbers", description: "Team of experienced barbers", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "Elegant Atmosphere", description: "Salon with modern design", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "Fast Service", description: "Efficient service without long wait", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
		},
		availableWorkshops: {
			ar: [
				{ 
					name: "صالون الرجال الفاخر", 
					image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "1.6 كم", 
					availableHours: "متاح اليوم من: 9 ص - 10 م"
				},
				{ 
					name: "حلاق الخبراء", 
					image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", 
					rating: 4.7, 
					distance: "2.2 كم", 
					availableHours: "متاح اليوم من: 10 ص - 9 م"
				},
			],
			en: [
				{ 
					name: "Luxury Men's Salon", 
					image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=400&fit=crop", 
					rating: 4.8, 
					distance: "1.6 km", 
					availableHours: "Available today: 9 AM - 10 PM"
				},
				{ 
					name: "Experts Barber", 
					image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop", 
					rating: 4.7, 
					distance: "2.2 km", 
					availableHours: "Available today: 10 AM - 9 PM"
				},
			],
		},
	},
	"construction-materials": {
		slug: "construction-materials",
		titleAr: "خدمات مواد البناء",
		titleEn: "Construction Materials Services",
		descriptionAr: "توريد وتوصيل جميع مواد البناء",
		descriptionEn: "Supply and delivery of all construction materials",
		heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
		videoThumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop",
		mainServices: {
			ar: [
				{ slug: "cement-bricks", title: "أسمنت وطوب", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/cement-bricks" },
				{ slug: "iron-steel", title: "حديد وصلب", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/iron-steel" },
				{ slug: "tiles-ceramics", title: "بلاط وسيراميك", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/tiles-ceramics" },
				{ slug: "sanitary-ware", title: "أدوات صحية", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/sanitary-ware" },
				{ slug: "doors-windows", title: "أبواب ونوافذ", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/doors-windows" },
				{ slug: "paints-insulation", title: "دهانات وعوازل", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/paints-insulation" },
			],
			en: [
				{ slug: "cement-bricks", title: "Cement and Bricks", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/cement-bricks" },
				{ slug: "iron-steel", title: "Iron and Steel", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/iron-steel" },
				{ slug: "tiles-ceramics", title: "Tiles and Ceramics", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/tiles-ceramics" },
				{ slug: "sanitary-ware", title: "Sanitary Ware", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/sanitary-ware" },
				{ slug: "doors-windows", title: "Doors and Windows", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/doors-windows" },
				{ slug: "paints-insulation", title: "Paints and Insulation", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/paints-insulation" },
			],
		},
		keyServices: {
			ar: [
				{ slug: "fast-delivery", title: "توصيل سريع", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/fast-delivery", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "best-prices", title: "أفضل الأسعار", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/best-prices", icon: React.createElement(Hammer, { className: "w-8 h-8" }) },
				{ slug: "high-quality-products", title: "منتجات عالية الجودة", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/high-quality-products", icon: React.createElement(Shield, { className: "w-8 h-8" }) },
			],
			en: [
				{ slug: "fast-delivery", title: "Fast Delivery", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/fast-delivery", icon: React.createElement(Wrench, { className: "w-8 h-8" }) },
				{ slug: "best-prices", title: "Best Prices", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/best-prices", icon: React.createElement(Hammer, { className: "w-8 h-8" }) },
				{ slug: "high-quality-products", title: "High Quality Products", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop", path: "/serve-me/construction-materials/high-quality-products", icon: React.createElement(Shield, { className: "w-8 h-8" }) },
			],
		},
		whyChooseUs: {
			ar: [
				{ title: "جودة مضمونة", description: "منتجات عالية الجودة ومضمونة", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "توصيل للموقع", description: "نوصل إلى موقع البناء مباشرة", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "أسعار تنافسية", description: "أفضل الأسعار في السوق", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
			en: [
				{ title: "Guaranteed Quality", description: "High quality guaranteed products", icon: React.createElement(Shield, { className: "w-12 h-12" }) },
				{ title: "Site Delivery", description: "We deliver directly to the construction site", icon: React.createElement(CircleDot, { className: "w-12 h-12" }) },
				{ title: "Competitive Prices", description: "Best prices in the market", icon: React.createElement(Wrench, { className: "w-12 h-12" }) },
			],
		},
		availableWorkshops: {
			ar: [
				{ 
					name: "مستودع مواد البناء الكبير", 
					image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop", 
					rating: 4.6, 
					distance: "5.0 كم", 
					availableHours: "متاح اليوم من: 7 ص - 6 م"
				},
				{ 
					name: "معرض مواد البناء المتكامل", 
					image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop", 
					rating: 4.7, 
					distance: "4.2 كم", 
					availableHours: "متاح اليوم من: 8 ص - 7 م"
				},
			],
			en: [
				{ 
					name: "Large Construction Materials Warehouse", 
					image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop", 
					rating: 4.6, 
					distance: "5.0 km", 
					availableHours: "Available today: 7 AM - 6 PM"
				},
				{ 
					name: "Complete Construction Materials Showroom", 
					image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop", 
					rating: 4.7, 
					distance: "4.2 km", 
					availableHours: "Available today: 8 AM - 7 PM"
				},
			],
		},
	},
};

/**
 * Individual Services Data
 * Maps `${categorySlug}/${serviceSlug}` to service details
 */
export const individualServicesData: Record<string, IndividualServiceData> = {
	// ============================================
	// HOME MAINTENANCE SERVICES
	// ============================================
	"home-maintenance/pest-control": {
		slug: "pest-control",
		titleAr: "مكافحة الحشرات",
		titleEn: "Pest Control",
		descriptionAr: "خدمة مكافحة الحشرات المحترفة بأحدث التقنيات",
		descriptionEn: "Professional pest control service with the latest technologies",
		heroImage: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=800&fit=crop",
		priceStartsFrom: 200,
		rating: 4.8,
		reviewsCount: 320,
		features: {
			ar: [
				{ text: "فحص شامل للمنزل", included: true },
				{ text: "مواد آمنة وصحية", included: true },
				{ text: "ضمان لمدة 6 أشهر", included: true },
				{ text: "خدمة طوارئ 24/7", included: false },
			],
			en: [
				{ text: "Comprehensive home inspection", included: true },
				{ text: "Safe and healthy materials", included: true },
				{ text: "6-month warranty", included: true },
				{ text: "24/7 emergency service", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "رش المبيدات الآمنة" },
				{ text: "معالجة النمل الأبيض" },
				{ text: "مكافحة الصراصير والفئران" },
				{ text: "تعقيم وتطهير شامل" },
			],
			en: [
				{ text: "Safe pesticide spraying" },
				{ text: "Termite treatment" },
				{ text: "Cockroach and rodent control" },
				{ text: "Comprehensive sterilization" },
			],
		},
	},
	"home-maintenance/electrical-services": {
		slug: "electrical-services",
		titleAr: "خدمات الكهرباء",
		titleEn: "Electrical Services",
		descriptionAr: "خدمات كهربائية شاملة من فنيين معتمدين",
		descriptionEn: "Comprehensive electrical services from certified technicians",
		heroImage: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&h=800&fit=crop",
		priceStartsFrom: 150,
		rating: 4.7,
		reviewsCount: 280,
		features: {
			ar: [
				{ text: "فنيون معتمدون", included: true },
				{ text: "ضمان على الأعمال", included: true },
				{ text: "أدوات حديثة", included: true },
				{ text: "صيانة دورية مجانية", included: false },
			],
			en: [
				{ text: "Certified technicians", included: true },
				{ text: "Work warranty", included: true },
				{ text: "Modern tools", included: true },
				{ text: "Free periodic maintenance", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "تركيب وصيانة الإضاءة" },
				{ text: "إصلاح الأعطال الكهربائية" },
				{ text: "تمديد الأسلاك" },
				{ text: "تركيب اللوحات الكهربائية" },
			],
			en: [
				{ text: "Lighting installation and maintenance" },
				{ text: "Electrical fault repair" },
				{ text: "Wire installation" },
				{ text: "Electrical panel installation" },
			],
		},
	},
	"home-maintenance/plumbing-services": {
		slug: "plumbing-services",
		titleAr: "خدمات السباكة",
		titleEn: "Plumbing Services",
		descriptionAr: "حلول سباكة سريعة وموثوقة",
		descriptionEn: "Fast and reliable plumbing solutions",
		heroImage: "https://images.unsplash.com/photo-1621905252472-6af3f59fd39e?w=1200&h=800&fit=crop",
		priceStartsFrom: 120,
		rating: 4.6,
		reviewsCount: 350,
		features: {
			ar: [
				{ text: "استجابة سريعة", included: true },
				{ text: "قطع غيار أصلية", included: true },
				{ text: "ضمان على الإصلاحات", included: true },
				{ text: "كشف تسربات متقدم", included: false },
			],
			en: [
				{ text: "Quick response", included: true },
				{ text: "Original spare parts", included: true },
				{ text: "Repair warranty", included: true },
				{ text: "Advanced leak detection", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "إصلاح الصنابير والمواسير" },
				{ text: "كشف وإصلاح التسربات" },
				{ text: "تسليك المجاري" },
				{ text: "تركيب السخانات" },
			],
			en: [
				{ text: "Faucet and pipe repair" },
				{ text: "Leak detection and repair" },
				{ text: "Drain unclogging" },
				{ text: "Water heater installation" },
			],
		},
	},
	"home-maintenance/home-cleaning": {
		slug: "home-cleaning",
		titleAr: "تنظيف المنازل والحدائق",
		titleEn: "Home and Garden Cleaning",
		descriptionAr: "خدمات تنظيف شاملة للمنازل والحدائق",
		descriptionEn: "Comprehensive cleaning services for homes and gardens",
		heroImage: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&h=800&fit=crop",
		priceStartsFrom: 180,
		rating: 4.9,
		reviewsCount: 420,
		features: {
			ar: [
				{ text: "فريق محترف", included: true },
				{ text: "مواد تنظيف صديقة للبيئة", included: true },
				{ text: "تأمين شامل", included: true },
				{ text: "خدمة شهرية مخفضة", included: false },
			],
			en: [
				{ text: "Professional team", included: true },
				{ text: "Eco-friendly cleaning materials", included: true },
				{ text: "Comprehensive insurance", included: true },
				{ text: "Discounted monthly service", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "تنظيف شامل للمنزل" },
				{ text: "تنظيف النوافذ والزجاج" },
				{ text: "تنظيف وتنسيق الحدائق" },
				{ text: "تلميع الأرضيات" },
			],
			en: [
				{ text: "Comprehensive home cleaning" },
				{ text: "Window and glass cleaning" },
				{ text: "Garden cleaning and landscaping" },
				{ text: "Floor polishing" },
			],
		},
	},
	"home-maintenance/ac-maintenance": {
		slug: "ac-maintenance",
		titleEn: "AC Repair and Maintenance",
		titleAr: "اصلاح وصيانة المكيفات",
		descriptionAr: "صيانة وإصلاح المكيفات بخبرة عالية",
		descriptionEn: "AC maintenance and repair with high expertise",
		heroImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=800&fit=crop",
		priceStartsFrom: 180,
		rating: 4.7,
		reviewsCount: 290,
		features: {
			ar: [
				{ text: "فنيون متخصصون", included: true },
				{ text: "فحص شامل", included: true },
				{ text: "ضمان على الخدمة", included: true },
				{ text: "عقد صيانة سنوي", included: false },
			],
			en: [
				{ text: "Specialized technicians", included: true },
				{ text: "Comprehensive inspection", included: true },
				{ text: "Service warranty", included: true },
				{ text: "Annual maintenance contract", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "تنظيف وصيانة المكيفات" },
				{ text: "إصلاح الأعطال" },
				{ text: "شحن الفريون" },
				{ text: "فحص الأداء" },
			],
			en: [
				{ text: "AC cleaning and maintenance" },
				{ text: "Fault repair" },
				{ text: "Freon recharge" },
				{ text: "Performance check" },
			],
		},
	},
	"home-maintenance/carpentry-services": {
		slug: "carpentry-services",
		titleAr: "خدمات النجارة",
		titleEn: "Carpentry Services",
		descriptionAr: "أعمال نجارة احترافية وتصاميم عصرية",
		descriptionEn: "Professional carpentry work and modern designs",
		heroImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=800&fit=crop",
		priceStartsFrom: 250,
		rating: 4.8,
		reviewsCount: 180,
		features: {
			ar: [
				{ text: "نجارون محترفون", included: true },
				{ text: "تصاميم حديثة", included: true },
				{ text: "خامات عالية الجودة", included: true },
				{ text: "تصميم ثلاثي الأبعاد", included: false },
			],
			en: [
				{ text: "Professional carpenters", included: true },
				{ text: "Modern designs", included: true },
				{ text: "High-quality materials", included: true },
				{ text: "3D design", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "تفصيل خزائن ومطابخ" },
				{ text: "صيانة الأبواب والشبابيك" },
				{ text: "أعمال الديكور الخشبي" },
				{ text: "تركيب الأرضيات الخشبية" },
			],
			en: [
				{ text: "Custom cabinets and kitchens" },
				{ text: "Door and window maintenance" },
				{ text: "Wooden decoration work" },
				{ text: "Wooden floor installation" },
			],
		},
	},
	"home-maintenance/water-tank-cleaning": {
		slug: "water-tank-cleaning",
		titleAr: "تنظيف خزانات المياه",
		titleEn: "Water Tank Cleaning",
		descriptionAr: "تنظيف وتعقيم خزانات المياه بأحدث الأجهزة",
		descriptionEn: "Water tank cleaning and sterilization with latest equipment",
		heroImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop",
		priceStartsFrom: 300,
		rating: 4.9,
		reviewsCount: 210,
		features: {
			ar: [
				{ text: "تعقيم كامل", included: true },
				{ text: "فحص جودة المياه", included: true },
				{ text: "شهادة صحية", included: true },
				{ text: "صيانة دورية", included: false },
			],
			en: [
				{ text: "Complete sterilization", included: true },
				{ text: "Water quality check", included: true },
				{ text: "Health certificate", included: true },
				{ text: "Periodic maintenance", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "تفريغ وتنظيف الخزان" },
				{ text: "تعقيم بمواد معتمدة" },
				{ text: "فحص التسربات" },
				{ text: "إصدار شهادة" },
			],
			en: [
				{ text: "Tank emptying and cleaning" },
				{ text: "Sterilization with approved materials" },
				{ text: "Leak inspection" },
				{ text: "Certificate issuance" },
			],
		},
	},
	"home-maintenance/indoor-cleaning": {
		slug: "indoor-cleaning",
		titleAr: "تنظيف وفحص الوحدة الداخلية",
		titleEn: "Indoor Unit Cleaning and Inspection",
		descriptionAr: "تنظيف وصيانة الوحدات الداخلية للمكيفات",
		descriptionEn: "Indoor AC unit cleaning and maintenance",
		heroImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&h=800&fit=crop",
		priceStartsFrom: 120,
		rating: 4.6,
		reviewsCount: 190,
		features: {
			ar: [
				{ text: "تنظيف عميق", included: true },
				{ text: "فحص شامل", included: true },
				{ text: "ضمان على الخدمة", included: true },
				{ text: "تغيير الفلاتر", included: false },
			],
			en: [
				{ text: "Deep cleaning", included: true },
				{ text: "Comprehensive inspection", included: true },
				{ text: "Service warranty", included: true },
				{ text: "Filter replacement", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "تنظيف الفلاتر" },
				{ text: "فحص المروحة" },
				{ text: "تعقيم الوحدة" },
				{ text: "اختبار الأداء" },
			],
			en: [
				{ text: "Filter cleaning" },
				{ text: "Fan inspection" },
				{ text: "Unit sterilization" },
				{ text: "Performance testing" },
			],
		},
	},
	"home-maintenance/tank-maintenance": {
		slug: "tank-maintenance",
		titleAr: "صيانة وتنظيف خزانات المياه",
		titleEn: "Water Tank Maintenance and Cleaning",
		descriptionAr: "صيانة شاملة وتنظيف دوري لخزانات المياه",
		descriptionEn: "Comprehensive maintenance and periodic cleaning of water tanks",
		heroImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop",
		priceStartsFrom: 350,
		rating: 4.8,
		reviewsCount: 160,
		features: {
			ar: [
				{ text: "صيانة دورية", included: true },
				{ text: "تنظيف وتعقيم", included: true },
				{ text: "فحص الأنابيب", included: true },
				{ text: "عقد صيانة سنوي", included: false },
			],
			en: [
				{ text: "Periodic maintenance", included: true },
				{ text: "Cleaning and sterilization", included: true },
				{ text: "Pipe inspection", included: true },
				{ text: "Annual maintenance contract", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "فحص شامل للخزان" },
				{ text: "إصلاح التسربات" },
				{ text: "تنظيف وتعقيم" },
				{ text: "اختبار جودة المياه" },
			],
			en: [
				{ text: "Comprehensive tank inspection" },
				{ text: "Leak repair" },
				{ text: "Cleaning and sterilization" },
				{ text: "Water quality testing" },
			],
		},
	},
	
	// ============================================
	// LEGAL SERVICES
	// ============================================
	"legal-services/legal-consultation": {
		slug: "legal-consultation",
		titleAr: "استشارة قانونية",
		titleEn: "Legal Consultation",
		descriptionAr: "نقدم خدمات قانونية واستشارية متكاملة",
		descriptionEn: "We provide complete legal and consultative services",
		heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=800&fit=crop",
		priceStartsFrom: 150,
		rating: 4.7,
		reviewsCount: 250,
		features: {
			ar: [
				{ text: "استشارة من محامي معتمد", included: true },
				{ text: "سرية تامة", included: true },
				{ text: "متابعة دورية", included: true },
				{ text: "تمثيل قانوني", included: false },
			],
			en: [
				{ text: "Consultation from certified lawyer", included: true },
				{ text: "Complete confidentiality", included: true },
				{ text: "Periodic follow-up", included: true },
				{ text: "Legal representation", included: false },
			],
		},
		serviceDetails: {
			ar: [
				{ text: "استشارات قانونية عامة" },
				{ text: "مراجعة العقود" },
				{ text: "استشارات أحوال شخصية" },
				{ text: "استشارات تجارية" },
			],
			en: [
				{ text: "General legal consultations" },
				{ text: "Contract review" },
				{ text: "Personal status consultations" },
				{ text: "Commercial consultations" },
			],
		},
	},
};

/**
 * Helper Functions
 */

// Get service category by slug
export  function getServiceCategoryBySlug(slug: string): ServiceCategoryData | undefined {
	return  serviceCategoriesData[slug];
}

// Get all service category slugs
export function getAllServiceCategorySlugs(): string[] {
	return Object.keys(serviceCategoriesData);
}

// Check if a service category slug is valid
export function isValidServiceCategorySlug(slug: string): boolean {
	return slug in serviceCategoriesData;
}

// Get individual service by category and service slug
export function getIndividualService(categorySlug: string, serviceSlug: string): IndividualServiceData | undefined {
	const key = `${categorySlug}/${serviceSlug}`;
	return individualServicesData[key];
}

// Get all individual service paths (for generating static paths)
export function getAllIndividualServicePaths(): Array<{ category: string; service: string }> {
	return Object.keys(individualServicesData).map(key => {
		const [category, service] = key.split("/");
		return { category, service };
	});
}

// Check if an individual service exists
export function isValidIndividualService(categorySlug: string, serviceSlug: string): boolean {
	const key = `${categorySlug}/${serviceSlug}`;
	return key in individualServicesData;
}
