"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/AuthContext"; // Uncomment when AuthContext is available

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
  },
];

export default function SelectPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFrequency, setSelectedFrequency] = useState<string>("daily");
  // const { user } = useAuth(); // Uncomment when AuthContext is available
  const router = useRouter();

  function handleCategoryToggle(categoryId: string) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }
  async function handleSavePreferences(e: FormEvent) {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      alert("Please select at least one category.");
      return;
    }

    // TODO: Add user authentication check when AuthContext is available
    // if (!user) {
    //     alert("Please log in to save your preferences.");
    //     return;
    // }

    try {
      // Simulate saving preferences
      const response = await fetch("/api/user-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: selectedCategories,
          frequency: selectedFrequency,
          // email is derived server-side from the authenticated user
        }),
      });

      // Try to parse error details, but don't break if it's not JSON
      let data: { error?: string } | null = null;
      try {
        data = await response.json();
      } catch {
        /* response had no JSON body */
      }

      if (!response.ok) {
        if (response.status === 401) {
          alert("Please sign in to save your preferences.");
          router.push("/sigin");
          return;
        }
        const message = data?.error || "Failed to save preferences";
        throw new Error(message);
      }

      alert(
        "Preferences saved successfully! You will start receiving updates."
      );
      router.push("/dashboard"); // Redirect to home or another page
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Failed to save preferences"
        }`
      );
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Customize Your Newsletter
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Select your interests and delivery frequency to start receiving
            personalized newsletters
          </p>
        </header>

        <form
          className="bg-white shadow-md rounded-lg p-6"
          onSubmit={handleSavePreferences}
        >
          {/* category selection */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Choose Your Categories
            </h2>
            <p className="text-gray-600 mb-4">
              Select the topics yod like to see in your personalized newsletter
            </p>

            <div className="grid gap-3">
              {categories.map((category) => {
                const selected = selectedCategories.includes(category.id);
                return (
                  <label
                    key={category.id}
                    htmlFor={category.id}
                    className={`flex items-start p-3 rounded-md hover:bg-gray-50 cursor-pointer transition border ${
                      selected
                        ? "bg-indigo-50 border-indigo-300"
                        : "border-transparent"
                    }`}
                  >
                    <input
                      id={category.id}
                      type="checkbox"
                      checked={selected}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="mt-1 h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 mr-3 flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-medium">
                        {category.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {category.description}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="mt-3">
              {selectedCategories.length > 0 ? (
                <p className="text-sm text-gray-500">
                  You have selected: {selectedCategories.join(", ")}
                </p>
              ) : (
                <p className="text-sm text-gray-500">No categories selected</p>
              )}
            </div>
          </section>

          {/* frequency selection (single indicator, applied via front UI) */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Choose Your Frequency
            </h2>
            <p className="text-gray-600 mb-4">
              How often would you like to receive updates?
            </p>

            {/* keep a hidden input so form submissions include the selected value */}
            <input type="hidden" name="frequency" value={selectedFrequency} />

            <div className="grid gap-3">
              {frequencyOptions.map((frequency) => {
                const isSelected = selectedFrequency === frequency.id;
                return (
                  <button
                    key={frequency.id}
                    type="button"
                    onClick={() => setSelectedFrequency(frequency.id)}
                    className={`flex items-start p-3 rounded-md hover:bg-gray-50 cursor-pointer transition border ${
                      isSelected
                        ? "bg-blue-50 border-blue-300"
                        : "border-transparent"
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex flex-col flex-grow text-left">
                      <span className="text-gray-800 font-medium">
                        {frequency.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {frequency.description}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 bg-white"
                      }`}
                      aria-hidden={true}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedCategories.length}{" "}
              {selectedCategories.length === 1 ? "category" : "categories"}{" "}
              selected • {selectedFrequency} delivery
            </div>
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                selectedCategories.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
