"use client";

import { memo } from "react";
import { Category } from "../Utils/CategoryCard";
import CategoriesPageComponent from "./CategoriesPage";

function CategoriesPage({ categories }: { categories: Category[] }) {
	return <CategoriesPageComponent categories={categories} />;
}

export default memo(CategoriesPage);
