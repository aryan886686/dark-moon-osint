import FeatureClient from './FeatureClient'

// Next.js 16 ko bolo ki static prerender mat karo, runtime pe render karo
export const instant = false

export default function FeaturePage({ params }: { params: Promise<{ feature: string }> }) {
  return <FeatureClient params={params} />
}
