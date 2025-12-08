import { generatePropertyMetadata } from "./metadata";

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('-');
  return await generatePropertyMetadata(slug);
}