import { getAttributes } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useAttributes = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["attributes"],
    queryFn: async () => await getAttributes(),
    select: (data) => {
      const cuisines = data.filter((item) => item.type === "cuisines");
      const diets = data.filter((item) => item.type === "diets");
      const occasions = data.filter((item) => item.type === "occasions");

      return { cuisines, diets, occasions };
    },
    staleTime: Infinity,
  });

  return { data, isLoading };
};

export const useFilteredAttributes = () => {
  const { data, isLoading } = useAttributes();

  return {
    data: {
      cuisines: data?.cuisines.filter((item) => item.type === "cuisines"),
      diets: data?.diets.filter((item) => item.type === "diets"),
      occasions: data?.occasions.filter((item) => item.type === "occasions"),
    },
    isLoading,
  };
};
