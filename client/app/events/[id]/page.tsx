// Mek iradardzyuni masnakrum — id-y URL-ic, Event component render
import { Event } from "@/components/Event";
type Params = {
  params: Promise<{ id: number }>;
};

export default async function page({ params }: Params) {

  const { id } = await params;

  return (
    <Event id={id}/>
  );
}
