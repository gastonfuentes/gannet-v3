import SectionHeading from "@/components/sections/SectionHeading";

/**
 * Deliberately card-free: a statement band sitting between two dense
 * sections. The reduced vertical rhythm is what keeps an isolated heading
 * reading as a pause rather than as an empty gap — at the site-wide
 * `lg:py-52` this would leave ~400px of dead space against its neighbours.
 */
const Partnership = () => (
  <section id="modelo" className="relative px-4 py-24 md:px-6 lg:px-8 lg:py-36">
    <div className="mx-auto max-w-4xl">
      <SectionHeading
        eyebrow="Nuestro modelo"
        title="Trabajamos como un socio, no como un proveedor"
        highlight="como un socio"
        description="La mayoría entrega un sistema, cobra y desaparece. Nosotros nos quedamos: acompañamos mes a mes, sostenemos lo que ya está funcionando y construimos lo que tu negocio vaya necesitando."
      />
    </div>
  </section>
);

export default Partnership;
