'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { saveAs } from 'file-saver'
import { Input } from "@/components/ui/input"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  hasInput?: boolean
}

interface ObjectiveParameter {
  id: number
  parameter: string
  options: string[]
  hasInput: true
}

// Add new interface for domain questions
interface DomainQuestion {
  id: number
  question: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "When trying to remember information, I am most likely to recall:",
    options: [
      "The picture or diagram I saw",
      "The experience or activity I was part of",
      "The explanation I heard"
    ],
    correctAnswer: 0,
    hasInput: true
  },
  {
    id: 2,
    question: "If I were learning how to assemble something, I would prefer:",
    options: [
      "Seeing an illustrated guide or watching a demonstration",
      "Doing it myself step-by-step with guidance",
      "Hearing step-by-step verbal instructions"
    ],
    correctAnswer: 0,
    hasInput: true
  },
  {
    id: 3,
    question: "To understand complex ideas best, I prefer:",
    options: [
      "Seeing charts, graphs, and visual examples",
      "Engaging in simulations or physical activities",
      "Listening to in-depth explanations or discussions"
    ],
    correctAnswer: 0,
    hasInput: true
  },
  {
    id: 4,
    question: "When recalling a conversation, I am most likely to remember:",
    options: [
      "The expressions and body language I saw",
      "How it felt to be part of that conversation",
      "The specific words and tone that were used"
    ],
    correctAnswer: 0,
    hasInput: true
  },
  {
    id: 5,
    question: "When I want to explain something complex to others, I usually:",
    options: [
      "Draw or show visual examples",
      "Demonstrate or have them practice it hands-on",
      "Talk them through it in detail, describing each part"
    ],
    correctAnswer: 0,
    hasInput: true
  }
]

const objectiveParameters: ObjectiveParameter[] = [
  {
    id: 1,
    parameter: "What is your primary focus in this learning experience?",
    options: [
      "Build foundational skills (e.g., Programming, Basics of a Subject)",
      "Prepare specifically for an upcoming exam or interview",
      "Advance my knowledge and expertise for career growth"
    ],
    hasInput: true
  },
  {
    id: 2,
    parameter: "Which learning format do you find most effective?",
    options: [
      "Structured courses with detailed lessons and explanations",
      "Practice-focused sessions like mock interviews or exam simulations",
      "Hands-on projects or real-world case studies"
    ],
    hasInput: true
  },
  {
    id: 3,
    parameter: "How would you rate your current knowledge level in this area?",
    options: [
      "Beginner - Just starting and learning basics",
      "Intermediate - Have some experience and looking to improve",
      "Advanced - Strong understanding, seeking depth and refinement"
    ],
    hasInput: true
  },
  {
    id: 4,
    parameter: "What is your main motivation for pursuing this learning?",
    options: [
      "To gain skills and confidence for a job or career shift",
      "To perform well in an upcoming exam or interview",
      "To gain personal expertise and deepen my interest in the field"
    ],
    hasInput: true
  }
]

// Add domain-specific questions
const domainQuestions: DomainQuestion[] = [
  {
    id: 1,
    question: "What specific technologies or tools do you want to focus on learning?"
  },
  {
    id: 2,
    question: "What are your current challenges in this domain?"
  },
  {
    id: 3,
    question: "What are your learning goals for the next 3 months?"
  },
  {
    id: 4,
    question: "What previous experience do you have in this domain?"
  }
]

export default function PP1() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const [objectiveAnswers, setObjectiveAnswers] = useState<(string | null)[]>(new Array(objectiveParameters.length).fill(null))
  const [customInputs, setCustomInputs] = useState<string[]>(new Array(objectiveParameters.length).fill(''))
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [showObjective, setShowObjective] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right')
  const [currentObjective, setCurrentObjective] = useState(0)
  const [showDomain, setShowDomain] = useState(false)
  const [currentDomain, setCurrentDomain] = useState(0)
  const [domainAnswers, setDomainAnswers] = useState<string[]>(new Array(domainQuestions.length).fill(''))

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = parseInt(value)
    setAnswers(newAnswers)
  }

  const handleObjectiveSelect = (paramIndex: number, value: string) => {
    const newAnswers = [...objectiveAnswers]
    newAnswers[paramIndex] = value
    setObjectiveAnswers(newAnswers)
  }

  const handleCustomInput = (paramIndex: number, value: string) => {
    const newInputs = [...customInputs]
    newInputs[paramIndex] = value
    setCustomInputs(newInputs)
    
    // Automatically select the custom input option
    handleObjectiveSelect(paramIndex, '3') // Index for custom input
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setSlideDirection('right')
      setCurrentQuestion(currentQuestion + 1)
    } else if (!showObjective) {
      setShowObjective(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setSlideDirection('left')
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // const handleObjectiveNext = () => {
  //   if (currentObjective < objectiveParameters.length - 1) {
  //     setSlideDirection('right')
  //     setCurrentObjective(currentObjective + 1)
  //   } else if (!showDomain) {
  //     setShowDomain(true)
  //   }
  // }

  const handleSubmit = async () => {
    // Only execute final submission when in domain questions and at the last question
    if (showDomain && currentDomain === domainQuestions.length - 1) {
      const results = {
        prompt: "You are a helpful assistant. Based on this parameters file, where Profile Parameters describe the personality of the learner, Domain parameters is the subject they want to learn, and objective parameters are the outcomes they expect, generate only a prompt, that can be used in other LLMs, fullfilling all criteria, on the subject mentioned in domain.",
        PersonalParameters: questions.map((question, index) => ({
          question: question.question,
          userAnswer: question.options[answers[index] || 0]
        })),
        ObjectiveParameters: objectiveParameters.map((param, index) => ({
          question: param.parameter,
          userAnswer: objectiveAnswers[index] === '3' ? 
            customInputs[index] : 
            param.options[parseInt(objectiveAnswers[index] || '0')]
        })),
        DomainParameters: domainQuestions.map((question, index) => ({
          question: question.question,
          userAnswer: domainAnswers[index]
        }))
      }

      try {
        // Send data to the endpoint
        const response = await fetch('/api/datacollector', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',// for the server to know what type of data is being sent
          },
          body: JSON.stringify(results)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Server response:', data);

        setShowResult(true)
      } catch (error) {
        console.error('Error sending data:', error);
        // You might want to show an error message to the user
        alert('Failed to submit quiz results. Please try again.');
      }
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setAnswers(new Array(questions.length).fill(null))
    setShowResult(false)
    setScore(0)
  }

  const generateResultJSON = () => {
    const results = {
      prompt: "You are a helpful assistant. Based on this parameters file, where Profile Parameters describe the personality of the learner, Domain parameters is the subject they want to learn, and objective parameters are the outcomes they expect, generate only a prompt, that can be used in other LLMs, fullfilling all criteria, on the subject mentioned in domain.",
      questions: questions.map((question, index) => ({
        question: question.question,
        userAnswer: question.options[answers[index] || 0]
      }))
    }
    return JSON.stringify(results, null, 2)
  }

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
              <CardTitle className="text-3xl text-center text-primary">Parameters Collected</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              {/* Personal Parameters */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Personal Parameters</h3>
                {questions.map((question, index) => (
                  <div key={index} className="bg-white/50 p-4 rounded-lg">
                    <p className="font-medium text-gray-700">{question.question}</p>
                    <p className="text-gray-600 mt-2">{question.options[answers[index] || 0]}</p>
                  </div>
                ))}
              </div>

              {/* Objective Parameters */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Objective Parameters</h3>
                {objectiveParameters.map((param, index) => (
                  <div key={index} className="bg-white/50 p-4 rounded-lg">
                    <p className="font-medium text-gray-700">{param.parameter}</p>
                    <p className="text-gray-600 mt-2">
                      {objectiveAnswers[index] === '3' 
                        ? customInputs[index] 
                        : param.options[parseInt(objectiveAnswers[index] || '0')]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Domain Parameters */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Domain Parameters</h3>
                {domainQuestions.map((question, index) => (
                  <div key={index} className="bg-white/50 p-4 rounded-lg">
                    <p className="font-medium text-gray-700">{question.question}</p>
                    <p className="text-gray-600 mt-2">{domainAnswers[index]}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white px-8 py-2 rounded-full transform transition-all hover:scale-105"
                >
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (showObjective) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentObjective}
              initial={{ x: slideDirection === 'right' ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: slideDirection === 'right' ? -100 : 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
                  <CardTitle className="text-xl flex justify-between items-center">
                    <span className="text-gray-800">Objective Parameter {currentObjective + 1}</span>
                    <span className="text-sm font-medium bg-white/80 px-3 py-1 rounded-full text-gray-600">
                      {currentObjective + 1} of {objectiveParameters.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  <div className="text-lg font-medium text-gray-700">
                    {objectiveParameters[currentObjective].parameter}
                  </div>
                  
                  <RadioGroup
                    value={objectiveAnswers[currentObjective] || undefined}
                    onValueChange={(value) => handleObjectiveSelect(currentObjective, value)}
                    className="space-y-3"
                  >
                    {objectiveParameters[currentObjective].options.map((option, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="transform transition-all duration-200 hover:scale-[1.01]"
                      >
                        <Label
                          htmlFor={`param-${currentObjective}-option-${index}`}
                          className="flex items-center p-4 rounded-lg border-2 border-purple-100 hover:border-purple-300 cursor-pointer bg-white hover:bg-purple-50 transition-all"
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`param-${currentObjective}-option-${index}`}
                            className="border-2 border-purple-300"
                          />
                          <span className="ml-3 text-gray-700">{option}</span>
                        </Label>
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="transform transition-all duration-200 hover:scale-[1.01]"
                    >
                      <div className="flex items-center p-4 rounded-lg border-2 border-purple-100 hover:border-purple-300 bg-white hover:bg-purple-50 transition-all">
                        <RadioGroupItem
                          value="3"
                          id={`param-${currentObjective}-custom`}
                          className="border-2 border-purple-300"
                        />
                        <Input
                          placeholder="Other (please specify)"
                          value={customInputs[currentObjective]}
                          onChange={(e) => handleCustomInput(currentObjective, e.target.value)}
                          className="ml-3 flex-1"
                        />
                      </div>
                    </motion.div>
                  </RadioGroup>

                  <div className="flex justify-between pt-6">
                    <Button
                      onClick={() => {
                        if (currentObjective > 0) {
                          setSlideDirection('left')
                          setCurrentObjective(currentObjective - 1)
                        } else {
                          setShowObjective(false)
                          setSlideDirection('left')
                        }
                      }}
                      variant="outline"
                      className="px-6 py-2 rounded-full hover:bg-purple-50 transition-all"
                    >
                      {currentObjective === 0 ? 'Back to Questions' : 'Previous'}
                    </Button>
                    <Button
                      onClick={() => {
                        if (currentObjective < objectiveParameters.length - 1) {
                          setSlideDirection('right')
                          setCurrentObjective(currentObjective + 1)
                        } else {
                          setShowDomain(true)
                          setShowObjective(false)
                          setSlideDirection('right')
                        }
                      }}
                      disabled={objectiveAnswers[currentObjective] === null}
                      className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white px-6 py-2 rounded-full transform transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {currentObjective === objectiveParameters.length - 1 ? 'Next' : 'Next'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="mt-4 bg-white/30 backdrop-blur-sm rounded-full h-2 p-[2px]">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent-purple rounded-full transition-all duration-300"
              style={{ width: `${((currentObjective + 1) / objectiveParameters.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  if (showDomain) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDomain}
              initial={{ x: slideDirection === 'right' ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: slideDirection === 'right' ? -100 : 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
                  <CardTitle className="text-xl flex justify-between items-center">
                    <span className="text-gray-800">Domain Question {currentDomain + 1}</span>
                    <span className="text-sm font-medium bg-white/80 px-3 py-1 rounded-full text-gray-600">
                      {currentDomain + 1} of {domainQuestions.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  <div className="text-lg font-medium text-gray-700">
                    {domainQuestions[currentDomain].question}
                  </div>
                  
                  <Input
                    value={domainAnswers[currentDomain]}
                    onChange={(e) => {
                      const newAnswers = [...domainAnswers]
                      newAnswers[currentDomain] = e.target.value
                      setDomainAnswers(newAnswers)
                    }}
                    placeholder="Enter your answer here..."
                    className="w-full p-4 border-2 border-purple-100 focus:border-purple-300 rounded-lg"
                  />

                  <div className="flex justify-between pt-6">
                    <Button
                      onClick={() => {
                        if (currentDomain > 0) {
                          setSlideDirection('left')
                          setCurrentDomain(currentDomain - 1)
                        }
                      }}
                      variant="outline"
                      className="px-6 py-2 rounded-full hover:bg-purple-50 transition-all"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => {
                        if (currentDomain < domainQuestions.length - 1) {
                          setSlideDirection('right')
                          setCurrentDomain(currentDomain + 1)
                        } else {
                          handleSubmit()
                        }
                      }}
                      disabled={!domainAnswers[currentDomain]}
                      className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white px-6 py-2 rounded-full transform transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {currentDomain === domainQuestions.length - 1 ? 'Submit' : 'Next'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="mt-4 bg-white/30 backdrop-blur-sm rounded-full h-2 p-[2px]">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent-purple rounded-full transition-all duration-300"
              style={{ width: `${((currentDomain + 1) / domainQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary via-accent-purple to-accent-pink">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ x: slideDirection === 'right' ? 100 : -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: slideDirection === 'right' ? -100 : 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full shadow-lg border border-white/20 bg-white/80 backdrop-blur-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent-purple/10">
                <CardTitle className="text-xl flex justify-between items-center">
                  <span className="text-gray-800">Question {currentQuestion + 1}</span>
                  <span className="text-sm font-medium bg-white/80 px-3 py-1 rounded-full text-gray-600">
                    {currentQuestion + 1} of {questions.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="text-lg font-medium text-gray-700">
                  {questions[currentQuestion].question}
                </div>
                
                <RadioGroup
                  value={answers[currentQuestion]?.toString()}
                  onValueChange={handleAnswerSelect}
                  className="space-y-3"
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="transform transition-all duration-200 hover:scale-[1.01]"
                    >
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex items-center p-4 rounded-lg border-2 border-purple-100 hover:border-purple-300 cursor-pointer bg-white hover:bg-purple-50 transition-all"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`option-${index}`}
                          className="border-2 border-purple-300"
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>

                <div className="flex justify-between pt-6">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="px-6 py-2 rounded-full hover:bg-purple-50 transition-all"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={answers[currentQuestion] === null}
                    className="bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 text-white px-6 py-2 rounded-full transform transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="mt-4 bg-white/30 backdrop-blur-sm rounded-full h-2 p-[2px]">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent-purple rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
