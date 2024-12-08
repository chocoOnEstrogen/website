import { generateMeta } from '@/lib/generateMeta'
import Layout from '@/components/Layout'
import AskComponent from '@/components/ask'
import { config } from '@/configs/main'

export function generateMetadata() {
    return generateMeta({
        title: `Ask ${config.name}`,
        path: '/ask',
        description: 'Ask me a question and I will create a post on Bluesky with your question and my response.'
    })
}

export default function AskPage() {
    return (
        <Layout>
           <AskComponent turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''} />
        </Layout>
    )
} 