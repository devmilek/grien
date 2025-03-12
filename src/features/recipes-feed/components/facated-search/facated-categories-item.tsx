import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Category } from "@/db/schema";
import { useRecipesFilters } from "../../hooks/use-recipes-filters";

const FacatedCategoriesItem = ({
  items,
}: {
  items: Category[] | undefined;
}) => {
  const { categorySlug, setCategorySlug } = useRecipesFilters();

  return (
    <AccordionItem value={"kategorie"}>
      <AccordionTrigger className="font-semibold">Kategorie</AccordionTrigger>
      <AccordionContent className="space-y-3">
        <RadioGroup value={categorySlug} onValueChange={setCategorySlug}>
          {items?.map((item) => (
            <div key={item.id} className="flex gap-2">
              <RadioGroupItem id={item.id} value={item.slug} />
              <label htmlFor={item.id} className="leading-none text-sm">
                {item.name}
              </label>
            </div>
          ))}
        </RadioGroup>
      </AccordionContent>
    </AccordionItem>
  );
};

export default FacatedCategoriesItem;
