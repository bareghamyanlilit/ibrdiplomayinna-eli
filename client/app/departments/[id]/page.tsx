// Mek masnagitvutyuni masnakrum — id-y URL-ic, Department component render
import { Department } from "@/components/department";

type Params = { params: Promise<{ id: string }> };

export default async function page({ params }: Params) {
  const { id } = await params;
  return <Department id={id} />;
}
