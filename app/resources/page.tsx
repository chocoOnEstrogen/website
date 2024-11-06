import { generateMeta } from '@/lib/generateMeta'
import Layout from '@/components/Layout'

export function generateMetadata() {
    return generateMeta({
        title: 'Trans Resources',
        path: '/resources',
        description: 'I made this page to help people like me find resources and information about transgender stuff. Read more here: https://bsky.app/profile/choco.rip/post/3lac3rncv432p'
    })
}

export default function TransResourcesPage() {
    return (
        <Layout>
            <div className="container mx-auto max-w-4xl px-4 py-12">
                <h1 className="mb-8 text-4xl font-bold text-purple-400">Trans Resources</h1>
                
                <div className="space-y-8">
                    {/* Important Notice */}
                    <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                        <p className="text-yellow-200">
                            ⚠️ The information provided here is for informational purposes only. 
                            Always consult with healthcare professionals for medical advice.
                        </p>
                    </div>

                    {/* Crisis Support - Moved to top */}
                    <section className="rounded-lg border border-red-500/50 bg-red-500/10 p-6">
                        <h2 className="mb-4 text-2xl font-semibold text-red-400">24/7 Crisis Support</h2>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>Suicide and Crisis Lifeline: <a href="tel:988" className="text-red-400 hover:underline">988</a></li>
                            <li>Crisis Text Line: Text <span className="text-red-400">741741</span></li>
                            <li>Trans Lifeline: <a href="tel:877-565-8860" className="text-red-400 hover:underline">877-565-8860</a></li>
                            <li>LGBT National Hotline: <a href="tel:888-843-4564" className="text-red-400 hover:underline">888-843-4564</a></li>
                        </ul>
                    </section>

                    {/* Mental Health */}
                    <section className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
                        <h2 className="mb-4 text-2xl font-semibold text-purple-400">Mental Health Resources</h2>
                        <ul className="list-disc space-y-2 pl-6">
                            <li><a href="https://www.thetrevorproject.org" className="text-purple-400 hover:underline">The Trevor Project (24/7 Crisis Support)</a></li>
                            <li><a href="https://www.pridecounseling.com" className="text-purple-400 hover:underline">Pride Counseling</a></li>
                            <li>Trans Lifeline: <a href="tel:1-877-565-8860" className="text-purple-400 hover:underline">1-877-565-8860</a></li>
                        </ul>
                    </section>

                    {/* Medical Resources */}
                    <section className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
                        <h2 className="mb-4 text-2xl font-semibold text-purple-400">Medical Resources</h2>
                        <ul className="list-disc space-y-2 pl-6">
                            <li><a href="https://www.wpath.org" className="text-purple-400 hover:underline">WPATH - Standards of Care</a></li>
                            <li><a href="https://www.plannedparenthood.org/learn/gender-identity/transgender" className="text-purple-400 hover:underline">Planned Parenthood Gender Services</a></li>
                        </ul>
                    </section>

                    {/* Legal Resources */}
                    <section className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
                        <h2 className="mb-4 text-2xl font-semibold text-purple-400">Legal Resources</h2>
                        <ul className="list-disc space-y-2 pl-6">
                            <li><a href="https://transgenderlawcenter.org" className="text-purple-400 hover:underline">Transgender Law Center</a></li>
                            <li><a href="https://www.lambdalegal.org" className="text-purple-400 hover:underline">Lambda Legal</a></li>
                        </ul>
                    </section>

                    {/* Community Support */}
                    <section className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
                        <h2 className="mb-4 text-2xl font-semibold text-purple-400">Community Support</h2>
                        <ul className="list-disc space-y-2 pl-6">
                            <li><a href="https://www.reddit.com/r/asktransgender" className="text-purple-400 hover:underline">r/asktransgender Community</a></li>
                            <li><a href="https://pflag.org" className="text-purple-400 hover:underline">PFLAG</a></li>
                        </ul>
                    </section>

                    {/* Educational Resources */}
                    <section className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
                        <h2 className="mb-4 text-2xl font-semibold text-purple-400">Educational Resources</h2>
                        <ul className="list-disc space-y-2 pl-6">
                            <li><a href="https://genderdysphoria.fyi" className="text-purple-400 hover:underline">The Gender Dysphoria Bible</a></li>
                            <li><a href="https://www.transhub.org.au/101" className="text-purple-400 hover:underline">Trans 101</a></li>
                        </ul>
                    </section>

                    {/* Healthcare Access - New Section */}
                    <section className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-purple-400">Healthcare Access</h2>
                        <ul className="list-disc space-y-2 pl-6">
                            <li><a href="https://www.outcarehealth.org" className="text-purple-400 hover:underline">OutCare - LGBTQ+ Healthcare Provider Directory</a></li>
                            <li><a href="https://www.glma.org/providers" className="text-purple-400 hover:underline">GLMA Provider Directory</a></li>
                            <li><a href="https://www.folxhealth.com" className="text-purple-400 hover:underline">FOLX Health - Virtual Trans Healthcare</a></li>
                            <li><a href="https://getplume.co" className="text-purple-400 hover:underline">Plume - Telehealth HRT Services</a></li>
                        </ul>
                    </section>

                    <section className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-6">
                        <h2 className="mb-4 text-2xl font-semibold text-yellow-400">DIY Resources (Do it at your own risk)</h2>
                        <ul className="list-disc space-y-2 pl-6">
                            <li>The DIY HRT Directory <a href="https://diyhrt.wiki/" className="text-red-400 hover:underline">https://diyhrt.wiki/</a></li>
                            <li>HRT Cafe <a href="https://hrtcafe.net/" className="text-red-400 hover:underline">https://hrtcafe.net/</a></li>
                            <li>Trans Fem HRT Guide <a href="https://diyhrt.market/transfem-hrt-guide" className="text-red-400 hover:underline">https://diyhrt.market/transfem-hrt-guide</a></li>
                        </ul>
                    </section>
                </div>
            </div>
        </Layout>
    )
} 