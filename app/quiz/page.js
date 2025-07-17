"use client";

import { useState, useEffect } from 'react'
import { supabase } from '@/src/supabaseClient'

export default function QuizPage() {
  const [allQuestions, setAllQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  // const [quizData, setQuizData] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const quizData = allQuestions[currentIndex]

  useEffect(() => {
    const fetchAllQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        // .limit(1)

    console.log("Fetched data:", data)
    console.log("Fetch error:", error)

      if (error) console.error(error)
      else setAllQuestions(data)
    }

    fetchAllQuestions()
  }, [])
// check answer function
  const checkAnswer = async () => {
    if (!quizData || selectedOption === null) return
    const correct = selectedOption === quizData.correct_option
    setIsCorrect(correct)
    setShowExplanation(true)

    // record attempt in supabase
    const {data, error } = await supabase
    .from('quiz_attempts')
    .insert([
      {question_id: quizData.id,
      is_correct: correct,
      // user_id: null, // if anonymous for now
      }
    ])
    // .select()
    if (error) {
      console.error("Error recording attempt:", error)
    } else {
      console.log("Attempt recorded:", data)
    }
    
  }

  // if (!quizData) return <p className="text-white">Loading... add quiz data</p>
  if(allQuestions.length == 0) return <p className="text-white">Loading...</p>
  if (!quizData) return <p className="text-white">No question at this index</p>

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-4">{quizData.summary}</h2>
        <p className="text-lg mb-6 text-center">{quizData.question}</p>  {/* ✅ ADD THIS LINE */}


      <div className="space-y-3 mb-4 w-full max-w-md">
        {quizData.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedOption(idx)}
            className={`block w-full px-4 py-2 rounded border
              ${selectedOption === idx ? 'bg-cyan-600' : 'bg-gray-800'}
            `}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        onClick={checkAnswer}
        className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded text-lg"
      >
        Check Answer
      </button>

      {showExplanation && (
        <div className="mt-6 bg-gray-900 p-4 rounded">
          <p className="mb-2">
            {isCorrect ? "✅ Correct!" : "❌ Wrong."}
          </p>
          <p className="text-sm text-gray-400">
            Explanation: {quizData.explanation}
          </p>

          <div className="flex space-x-4">
      <button
        onClick={() => {
          setSelectedOption(null)
          setShowExplanation(false)
          setIsCorrect(null)
        }}
        className="bg-cyan-700 px-4 py-2 rounded"
      >
        Repeat Quiz
      </button>
      <button
        onClick={async () => {
          setSelectedOption(null)
          setShowExplanation(false)
          setIsCorrect(null)
          // increment index
          const nextIndex = (currentIndex + 1) % allQuestions.length
          setCurrentIndex(nextIndex)
          // fetch new quiz data
          // const { data, error } = await supabase
          //   .from('questions')
          //   .select('*')
          //   .neq('id', quizData.id)
          //   // .limit(1)
          // if (error) console.error(error)

          // else if (data.length > 0) {
          //   const randomIndex = Math.floor(Math.random() * data.length)
          //   setQuizData(data[randomIndex])

          // }
          // else {
          //   alert("No new questions found.")
          // }
        }}
        className="bg-cyan-500 px-4 py-2 rounded"
      >
        New Quiz
      </button>
    </div>
        </div>
      )}
    </main>
  )
}
