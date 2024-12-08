'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Callout } from '@/components/ui/callout'
import { motion } from 'framer-motion'
import { config } from '@/configs/main'
import { Turnstile } from '@marsidev/react-turnstile'

interface AskComponentProps {
    turnstileSiteKey: string;
}

const COOLDOWN_MINUTES = 5
const COOLDOWN_KEY = 'ask_cooldown'
const CHAR_LIMIT = 100

export default function AskComponent({ turnstileSiteKey }: AskComponentProps) {
    const [question, setQuestion] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [cooldownRemaining, setCooldownRemaining] = useState<number>(0)
    const [turnstileToken, setTurnstileToken] = useState<string>('')
    const [ipAddress, setIpAddress] = useState<string>('')

    useEffect(() => {
        // Check cooldown on component mount
        const cooldownUntil = localStorage.getItem(COOLDOWN_KEY)
        if (cooldownUntil) {
            const remainingTime = Math.ceil((parseInt(cooldownUntil) - Date.now()) / 1000)
            if (remainingTime > 0) {
                setCooldownRemaining(remainingTime)
                const timer = setInterval(() => {
                    setCooldownRemaining(prev => {
                        if (prev <= 1) {
                            clearInterval(timer)
                            localStorage.removeItem(COOLDOWN_KEY)
                            return 0
                        }
                        return prev - 1
                    })
                }, 1000)
                return () => clearInterval(timer)
            } else {
                localStorage.removeItem(COOLDOWN_KEY)
            }
        }
    }, [])

    useEffect(() => {
        // Fetch IP address when component mounts
        fetch('/api/ip')
            .then(res => res.json())
            .then(data => setIpAddress(data.ip))
            .catch(console.error)
    }, [])

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        
        if (!turnstileToken) {
            setError('Please complete the CAPTCHA verification')
            return
        }

        // Check cooldown
        if (cooldownRemaining > 0) {
            setError(`Please wait ${formatTime(cooldownRemaining)} before asking another question`)
            return
        }

        // Validate question length
        if (question.length > CHAR_LIMIT) {
            setError(`Question must be less than ${CHAR_LIMIT} characters`)
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`/api/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: question,
                    turnstileToken,
                    ipAddress,
                }),
            })

            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit question')
            }

            // Set cooldown in localStorage
            const cooldownUntil = Date.now() + (COOLDOWN_MINUTES * 60 * 1000)
            localStorage.setItem(COOLDOWN_KEY, cooldownUntil.toString())
            setCooldownRemaining(COOLDOWN_MINUTES * 60)

            setSuccess(true)
            setQuestion('')
        } catch (err) {
            console.error('Submit error:', err)
            setError(err instanceof Error ? err.message : 'Failed to submit question')
        } finally {
            setLoading(false)
        }
    }

    const handleTurnstileSuccess = (token: string) => {
        setTurnstileToken(token)
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-12">
            <motion.h1 
                className="mb-8 text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Ask {config.name}
            </motion.h1>
            
            <Callout type="note" className="mb-8 border-purple-500/20">
                Ask me anything! I&apos;ll respond to your question and post both the question and answer on Bluesky.
            </Callout>

            {error && (
                <Callout type="warning" className="mb-4 border-red-500/20">
                    {error}
                </Callout>
            )}

            {success && (
                <Callout type="tip" className="mb-4 border-green-500/20">
                    Your question has been submitted successfully! Check Bluesky for the response.
                </Callout>
            )}

            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-purple-400">Ask a Question</CardTitle>
                    <CardDescription className="text-gray-400">
                        Your question will be answered and shared publicly on Bluesky
                        {cooldownRemaining > 0 && (
                            <div className="mt-2 text-yellow-400">
                                You can ask another question in {formatTime(cooldownRemaining)}
                            </div>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="question" className="text-gray-300">
                                Your Question
                            </Label>
                            <div className="relative">
                                <Input
                                    id="question"
                                    placeholder="What would you like to ask?"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    className="resize-none bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500 focus-visible:ring-purple-400"
                                    maxLength={CHAR_LIMIT}
                                    disabled={cooldownRemaining > 0}
                                />
                                <div className="absolute bottom-2 right-2 text-sm text-gray-400">
                                    {question.length}/{CHAR_LIMIT}
                                </div>
                            </div>
                        </div>
                        <Turnstile
                            siteKey={turnstileSiteKey}
                            onSuccess={handleTurnstileSuccess}
                        />
                       
                        <Button 
                            type="submit" 
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                            disabled={loading || !question.trim() || cooldownRemaining > 0 || !turnstileToken}
                        >
                            {loading ? 'Submitting...' : 
                             cooldownRemaining > 0 ? `Wait ${formatTime(cooldownRemaining)}` : 
                             !turnstileToken ? 'Complete CAPTCHA' : 
                             'Submit Question'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}