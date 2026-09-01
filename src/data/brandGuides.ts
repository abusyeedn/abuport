// Brand guide PDFs - add more objects here as new ones come in. The list
// page and detail page both read from this, so nothing else needs to change.
export type BrandGuideDoc = {
  slug: string
  title: string
  subtitle: string
  file: string
}

export const BRAND_GUIDES: BrandGuideDoc[] = [
  { slug: 'haven', title: 'Haven', subtitle: 'Brand guide', file: '/gallery/brand/haven.pdf' },
]
