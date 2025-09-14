'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RotateCcw, Trophy, Clock } from 'lucide-react'

interface Quiz {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

// 정적 퀴즈 데이터
const quizData: Quiz[] = [
  {
    id: 1,
    question: "우리나라에서 한부모가족의 비율은 전체 가구의 몇 퍼센트일까요?",
    options: ["약 5%", "약 10%", "약 15%", "약 20%"],
    correctAnswer: 1,
    explanation: "통계청 자료에 따르면 우리나라 한부모가족은 전체 가구의 약 10%를 차지합니다.",
    category: "가족통계"
  },
  {
    id: 2,
    question: "가족의 형태가 다양해지는 현상을 무엇이라고 할까요?",
    options: ["가족해체", "가족다양성", "가족위기", "가족갈등"],
    correctAnswer: 1,
    explanation: "현대사회에서 나타나는 다양한 가족 구성을 '가족다양성'이라고 합니다.",
    category: "가족개념"
  },
  {
    id: 3,
    question: "서울특별시한부모가족지원센터의 주요 사업이 아닌 것은?",
    options: ["생활안정지원", "자녀양육지원", "취업지원", "주택분양사업"],
    correctAnswer: 3,
    explanation: "한부모가족지원센터는 생활안정, 자녀양육, 취업지원 등을 주요 사업으로 하며, 주택분양사업은 포함되지 않습니다.",
    category: "기관정보"
  },
  {
    id: 4,
    question: "모두하나대축제가 열리는 장소는 어디일까요?",
    options: ["한강공원", "여의도공원", "올림픽공원", "선유도공원"],
    correctAnswer: 1,
    explanation: "모두하나대축제는 여의도공원 문화의마당에서 개최됩니다.",
    category: "축제정보"
  },
  {
    id: 5,
    question: "가족 간의 소통을 위해 가장 중요한 것은 무엇일까요?",
    options: ["경제력", "서로에 대한 이해와 존중", "많은 시간", "비슷한 취미"],
    correctAnswer: 1,
    explanation: "가족 간의 건강한 소통을 위해서는 서로에 대한 이해와 존중이 가장 중요합니다.",
    category: "가족관계"
  }
]

const categories = ["전체", "가족통계", "가족개념", "기관정보", "축제정보", "가족관계"]

export default function QuizEvent() {
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isQuizCompleted, setIsQuizCompleted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [filteredQuizzes, setFilteredQuizzes] = useState(quizData)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(30) // 30초 제한시간
  const [timerActive, setTimerActive] = useState(false)

  // 카테고리 필터링
  useEffect(() => {
    if (selectedCategory === "전체") {
      setFilteredQuizzes(quizData)
    } else {
      setFilteredQuizzes(quizData.filter(quiz => quiz.category === selectedCategory))
    }
    resetQuiz()
  }, [selectedCategory])

  // 타이머 관리
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleAnswerSubmit()
    }
    return () => clearInterval(interval)
  }, [timerActive, timeLeft, showResult])

  // 퀴즈 시작시 타이머 시작
  useEffect(() => {
    if (!isQuizCompleted) {
      setTimerActive(true)
      setTimeLeft(30)
    }
  }, [currentQuiz, isQuizCompleted])

  const resetQuiz = () => {
    setCurrentQuiz(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setIsQuizCompleted(false)
    setUserAnswers([])
    setTimeLeft(30)
    setTimerActive(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult && timeLeft > 0) {
      setSelectedAnswer(answerIndex)
    }
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null && timeLeft > 0) return
    
    setTimerActive(false)
    setShowResult(true)
    
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuiz] = selectedAnswer
    setUserAnswers(newUserAnswers)
    
    if (selectedAnswer === filteredQuizzes[currentQuiz].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuiz = () => {
    if (currentQuiz < filteredQuizzes.length - 1) {
      setCurrentQuiz(currentQuiz + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(30)
      setTimerActive(true)
    } else {
      setIsQuizCompleted(true)
      setTimerActive(false)
    }
  }

  const getCurrentQuiz = () => filteredQuizzes[currentQuiz]

  if (filteredQuizzes.length === 0) {
    return (
      <div className="p-8 md:p-12 text-center">
        <div className="text-6xl mb-4">🧩</div>
        <h3 className="text-xl font-semibold mb-4">해당 카테고리의 퀴즈가 없습니다</h3>
        <button
          onClick={() => setSelectedCategory("전체")}
          className="px-6 py-3 bg-festival-green text-white rounded-xl hover:bg-festival-green/90 transition-colors"
        >
          전체 카테고리 보기
        </button>
      </div>
    )
  }

  return (
    <div className="p-8 md:p-12">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-festival-green/10 rounded-full mb-6">
          <span className="text-2xl">🧩</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          가족 퀴즈 챌린지
        </h2>
        <p className="text-lg text-gray-600">
          가족과 관련된 다양한 퀴즈를 풀어보세요!
        </p>
      </div>

      {/* 카테고리 선택 */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-festival-green text-white'
                  : 'bg-white/50 text-gray-600 hover:bg-white/70'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {!isQuizCompleted ? (
        <div className="max-w-2xl mx-auto">
          {/* 진행상황 및 타이머 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-festival-green font-semibold">
                {currentQuiz + 1} / {filteredQuizzes.length}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-festival-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuiz + 1) / filteredQuizzes.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-festival-orange">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{timeLeft}초</span>
            </div>
          </div>

          {/* 퀴즈 카드 */}
          <div className="bg-white/70 rounded-2xl p-8 mb-6">
            <div className="text-sm text-festival-green font-medium mb-4">
              {getCurrentQuiz().category}
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
              {getCurrentQuiz().question}
            </h3>

            <div className="space-y-3">
              {getCurrentQuiz().options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult || timeLeft === 0}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                    showResult
                      ? index === getCurrentQuiz().correctAnswer
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : selectedAnswer === index
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 bg-gray-50'
                      : selectedAnswer === index
                      ? 'border-festival-green bg-festival-green/10'
                      : 'border-gray-200 hover:border-festival-green/50 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <div>
                        {index === getCurrentQuiz().correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {selectedAnswer === index && index !== getCurrentQuiz().correctAnswer && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* 설명 (정답 공개 후) */}
            {showResult && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2">💡 설명</h4>
                <p className="text-blue-700">{getCurrentQuiz().explanation}</p>
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="text-center">
            {!showResult ? (
              <button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="px-8 py-3 bg-festival-green text-white font-semibold rounded-xl hover:bg-festival-green/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                정답 확인
              </button>
            ) : (
              <button
                onClick={handleNextQuiz}
                className="px-8 py-3 bg-festival-green text-white font-semibold rounded-xl hover:bg-festival-green/90 transition-colors"
              >
                {currentQuiz < filteredQuizzes.length - 1 ? '다음 문제' : '결과 보기'}
              </button>
            )}
          </div>
        </div>
      ) : (
        // 결과 화면
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/70 rounded-2xl p-8">
            <div className="text-6xl mb-6">
              {score === filteredQuizzes.length ? '🏆' : score >= filteredQuizzes.length * 0.7 ? '🎉' : '📚'}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              퀴즈 완료!
            </h3>
            <div className="text-4xl font-bold text-festival-green mb-4">
              {score} / {filteredQuizzes.length}
            </div>
            <p className="text-gray-600 mb-6">
              {score === filteredQuizzes.length
                ? '완벽해요! 가족에 대해 정말 잘 알고 계시네요! 🌟'
                : score >= filteredQuizzes.length * 0.7
                ? '잘했어요! 가족에 대한 지식이 풍부하시네요! 👏'
                : '더 배워보세요! 가족에 대해 더 알아가는 기회가 될 거예요! 💪'
              }
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetQuiz}
                className="flex items-center space-x-2 px-6 py-3 bg-festival-green text-white font-semibold rounded-xl hover:bg-festival-green/90 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>다시 도전</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}