// Mek ambioni masnakrum — id-y URL-ic, Chair component render
import { Chair } from "@/components/chair";

type Params = { params: Promise<{ id: string }> };

export default async function page({ params }: Params) {
  const { id } = await params;
  return <Chair id={id} />;
}
