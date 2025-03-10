import Regulamin from "@/app/(main)/(mdx)/regulamin/regulamin.mdx";
import { constructMetadata } from "@/utils/construct-metadata";

export const metadata = constructMetadata({
  title: "Regulamin",
  noIndex: true,
});

export default function Page() {
  return <Regulamin />;
}
