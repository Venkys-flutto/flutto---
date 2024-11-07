'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function QuizResults() {
  const [response, setResponse] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const responseData = sessionStorage.getItem('quizResponse')
      if (responseData) {
        const parsedData = JSON.parse(responseData)
        // Extract the nested response value
        const actualResponse = parsedData?.response?.response || parsedData?.response || parsedData
        setResponse(actualResponse)
        console.log('Parsed response:', actualResponse)
      }
    } catch (error) {
      console.error('Error parsing response data:', error)
      setResponse('Error loading response. Please try again.')
    }
  }, [])

  if (!response) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
        <Card className="w-96 shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-700">Generating your personalized learning path...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
            <CardTitle className="text-2xl text-center text-primary">Your Learning Path</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose max-w-none">
              <div className="mb-4 p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {response}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <Button
            onClick={() => router.push('/initialquiz')}
            variant="outline"
            className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
          >
            Learn another topic
          </Button>
          <Button
            onClick={() => {
              const blob = new Blob([response], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'learning-path.txt'
              a.click()
            }}
            className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white"
          >
            Save Results
          </Button>
        </div>
      </div>
    </div>
  )
} 