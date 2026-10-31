import { HeroStage, type HeroSlide } from "@/components/home/hero-stage";
import { getDeliveryMap } from "@/lib/cj/delivery";
import { getProduct, type ProductSlug } from "@/lib/products";
import { site } from "@/lib/site";

/** Ordre du hero : du plus complet au plus accessible. */
const ORDER: ProductSlug[] = ["q3", "s2", "o1"];

/** Première phrase de la description, pour le bas du hero. */
function firstSentence(text: string) {
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

export async function Hero() {
  const deliveries = await getDeliveryMap();
  const slides: HeroSlide[] = ORDER.map((slug) => {
    const product = getProduct(slug)!;
    return {
      slug,
      name: `${site.name} ${product.model}`,
      model: product.model,
      tagline: product.tagline,
      summary: firstSentence(product.description),
      price: product.price,
      inStock: deliveries[slug].inStock,
      scene: product.scene,
      cutout: product.hero,
    };
  });

  return <HeroStage slides={slides} />;
}
