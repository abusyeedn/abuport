import { useParams, useNavigate } from 'react-router-dom'
import { ALL_KYNHOOD_CARDS, CaseStudyPanel } from '../components/KynhoodBentoCards'

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// Real, standalone page for a single Kynhood sub-project - CaseStudyPanel is
// already built as a full-screen view (see its own comment), so giving it a
// real route here is all that's needed to turn what used to be a modal into
// an actual bookmarkable/shareable page.
export default function KynhoodCasePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const card = ALL_KYNHOOD_CARDS.find((c) => slugify(c.title) === slug)

  if (!card) {
    navigate('/', { replace: true })
    return null
  }

  return <CaseStudyPanel card={card} onClose={() => navigate('/#work')} />
}
