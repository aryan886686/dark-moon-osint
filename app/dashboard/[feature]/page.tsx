import FeatureClient from './FeatureClient'

export default function FeaturePage({ params }: { params: Promise<{ feature: string }> }) {
  return <FeatureClient params={params} />
}
