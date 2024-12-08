import { generateMeta } from '@/lib/generateMeta'
import Layout from '@/components/Layout'
import AskComponent from '@/components/ask'

export function generateMetadata() {
    return generateMeta({
        title: 'Ask Choco',
        path: '/ask',
        description: 'Ask me a question and I will create a post on Bluesky with your question and my response.'
    })
}

export default function AskPage() {
    return (
        <Layout>
           <AskComponent />
        </Layout>
    )
} 