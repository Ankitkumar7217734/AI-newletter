"use client";
import { useState } from "react";

const categories = [
    {
        id: "technology",
        name: "Technology",
        description: "Latest tech news and innovations",
    },
    {
        id: "business",
        name: "Business",
        description: "Business trends and market updates",
    },
    { id: "sports", name: "Sports", description: "Sports news and highlights" },
    {
        id: "entertainment",
        name: "Entertainment",
        description: "Movies, TV, and celebrity news",
    },
    {
        id: "science",
        name: "Science",
        description: "Scientific discoveries and research",
    },
    { id: "health", name: "Health", description: "Health and wellness updates" },
    {
        id: "politics",
        name: "Politics",
        description: "Political news and current events",
    },
    {
        id: "environment",
        name: "Environment",
        description: "Climate and environmental news",
    },
];

const frequencyOptions = [
    {
        id: "daily",
        label: "Daily",
        description: "Receive updates every day",
    },
    {
        id: "weekly",
        label: "Weekly",
        description: "Receive updates every week",
    },
    {
        id: "biweekly",
        label: "Biweekly",
        description: "Receive updates every two weeks",
    }
];

export default function SelectPage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedFrequency, setSelectedFrequency] = useState<string>("daily");

    function handleCategoryToggle(categoryId: string) {
        setSelectedCategories((prev) =>
            prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Customize Your Newsletter</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Select your interests and delivery frequency to start receiving personalized newsletters
                    </p>
                </header>

                <form className="bg-white shadow-md rounded-lg p-6">
                    {/* category selection */}
                    <section className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Categories</h2>
                        <p className="text-gray-600 mb-4">
                            Select the topics youd like to see in your personalized newsletter
                        </p>

                        <div className="grid gap-3">
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    htmlFor={category.id}
                                    className="flex items-start p-3 rounded-md hover:bg-gray-50 cursor-pointer transition"
                                >
                                    <input
                                        id={category.id}
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => handleCategoryToggle(category.id)}
                                        className="mt-1 h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-3 flex-shrink-0"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-gray-800 font-medium">{category.name}</span>
                                        <span className="text-sm text-gray-500">{category.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div>
                            {selectedCategories.length > 0 ? (
                                <p className="text-sm text-gray-500">
                                    You have selected: {selectedCategories.join(", ")}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500">No categories selected</p>
                            )}
                        </div>
                    </section>

                    {/* frequency selection (placeholder) */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Your Frequency</h2>
                        <p className="text-gray-600 mb-4">
                            How often would you like to receive updates?
                        </p>

                        <div className="grid gap-3">
                            {frequencyOptions.map((frequency, key) => (
                                <label
                                    key={frequency.id}
                                    htmlFor={frequency.id}
                                    className="flex items-start p-3 rounded-md hover:bg-gray-50 cursor-pointer transition"
                                >
                                    <input
                                        id={frequency.id}
                                        type="radio"
                                        name="frequency"
                                        className="mt-1 h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-3 flex-shrink-0" onChange={() => setSelectedFrequency(frequency.id)}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-gray-800 font-medium">{frequency.label}</span>
                                        <span className="text-sm text-gray-500">{frequency.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                   
                </form>
            </div>
        </div>
    );
}
