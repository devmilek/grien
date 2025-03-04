import { getAttributes } from "@/actions";
import { useQuery } from "@tanstack/react-query";

export const useAttributes = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["attributes", "categories"],
    queryFn: async () => await getAttributes(),
    staleTime: Infinity,
  });

  return { data, isLoading };
};
