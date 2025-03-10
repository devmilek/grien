import Polityka from "@/app/(main)/(mdx)/polityka-prywatnosci/polityka.mdx";
import { constructMetadata } from "@/utils/construct-metadata";

export const metadata = constructMetadata({
  title: "Polityka prywatności",
  noIndex: true,
});

export default function Page() {
  return <Polityka />;
}
