import FeatureClient from './FeatureClient'

// Ye line Next.js ko bolti hai ki is page ko static mat banao
export const dynamic = 'force-dynamic'

export default function FeaturePage({ params }: { params: Promise<{ feature: string }> }) {
  return <FeatureClient params={params} />
}
