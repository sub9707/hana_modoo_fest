'use client'

import { useState, useEffect } from 'react'
import { Trophy, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const mockQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: '한부모가족의 정의에 가장 적합한 것은?',
    options: [
      '아버지나 어머니 중 한 분과 18세 미만 자녀로 구성된 가족',
      '조부모와 함께 사는 가족',
      '결혼하지 않은 가족',
      '자녀가 없는 가족'
    ],
    correctAnswer: 0,
    explanation: '한부모가족은 부모 중 한 분과 18세 미만의 자녀로 구성된 가족을 의미합니다.'
  },
  {
    id: '2',
    question: '가족다양성이란 무엇을 의미할까요?',
    options: [
      '가족 구성원의 수가 많은 것',
      '다양한 형태의 가족을 인정하고 존중하는 것',
      '여러 지역에 사는 가족',
      '다양한 직업을 가진 가족'
    ],
    correctAnswer: 1,
    explanation: '가족다양성은 핵가족, 한부모가족, 조손가족 등 다양한 형태의 가족을 모두 인정하고 존중하는 개념입니다.'
  }
]


export default function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer()
    }
  }, [timeLeft, showResult, quizCompleted])

  const handleAnswer = () => {
    const isCorrect = selectedAnswer === mockQuestions[currentQuestion].correctAnswer
    if (isCorrect) setScore(score + 1)
    
    setAnswers([...answers, selectedAnswer ?? -1])
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(30)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setTimeLeft(30)
    setQuizCompleted(false)
    setAnswers([])
  }

  const getScoreMessage = () => {
    const percentage = (score / mockQuestions.length) * 100
    if (percentage === 100) return '완벽해요! 🎉'
    if (percentage >= 80) return '훌륭해요! 👏'
    if (percentage >= 60) return '좋아요! 👍'
    return '다시 도전해보세요! 💪'
  }

  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>퀴즈 완료!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <div className="text-6xl font-bold text-primary">
                {score}/{mockQuestions.length}
              </div>
              <p className="text-xl font-semibold">
                {getScoreMessage()}
              </p>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-4">퀴즈 결과</h3>
              <div className="space-y-3">
                {mockQuestions.map((question, index) => (
                  <div key={question.id} className="flex items-center justify-between">
                    <span className="text-sm">문제 {index + 1}</span>
                    {answers[index] === question.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {score >= mockQuestions.length * 0.8 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-medium">
                  🎁 축하합니다! 80점 이상으로 상품 추첨 대상에 포함되었습니다.
                </p>
              </div>
            )}

            <Button onClick={handleRestart} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 도전하기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>문제 {currentQuestion + 1} / {mockQuestions.length}</span>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>{timeLeft}초</span>
            </div>
          </CardTitle>
          <Progress value={(timeLeft / 30) * 100} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {mockQuestions[currentQuestion].question}
            </h2>
            
            <div className="space-y-3">
              {mockQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                 onClick={() => !showResult && setSelectedAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-colors ${
                    showResult
                      ? index === mockQuestions[currentQuestion].correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : index === selectedAnswer
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-muted bg-muted text-muted-foreground'
                      : selectedAnswer === index
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-muted hover:border-primary/50 hover:bg-muted'
                  }`}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && index === mockQuestions[currentQuestion].correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {showResult && index === selectedAnswer && index !== mockQuestions[currentQuestion].correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showResult && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">설명</h3>
              <p className="text-blue-800">
                {mockQuestions[currentQuestion].explanation}
              </p>
            </div>
          )}

          <div className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              현재 점수: {score} / {mockQuestions.length}
            </div>
            
            {!showResult ? (
              <Button 
                onClick={handleAnswer}
                disabled={selectedAnswer === null}
              >
                답안 제출
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {currentQuestion < mockQuestions.length - 1 ? '다음 문제' : '결과 보기'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}