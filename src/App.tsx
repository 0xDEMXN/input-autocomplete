import { useState } from "react";
import AutocompleteInput from "./components/AutocompleteInput";
import { useQuery } from "react-query";
import axios from "axios";

type Recipe = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
};

const App = () => {
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["recipes", query],
    queryFn: async () => {
      if (!query) return;

      const { data } = await axios.get(
        `https://dummyjson.com/recipes/search?q=${query}`
      );
      return data.recipes.map((recipe: Recipe) => recipe.name);
    },
  });

  return (
    <div className="h-full grid place-items-center">
      <form className="w-80">
        <AutocompleteInput
          title="Recipes"
          placeholder="Search a recipe..."
          onSelectedValue={setQuery}
          data={data}
          minLength={2}
          limit={7}
        />
      </form>
    </div>
  );
};

export default App;
