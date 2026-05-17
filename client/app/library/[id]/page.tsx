// Gradrani anunner mek masnagitvutyunov — id-y URL-ic, LibraryName component
import {LibraryName} from "@/components/LibraryName";


// Ընտրված մասնագիտության էջ
type Params = {
  params: Promise<{ id: number }>;
};

export default async function page({ params }: Params) {

  const { id } = await params;

  return (
    <LibraryName id={id}/>
  );
}
