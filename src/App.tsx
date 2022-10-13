import React, { useEffect, useState } from "react";
import { fetchQuizQuestions } from "./API";
import { Statistic } from "antd";
import "antd/dist/antd.css";
// Components
import QuestionCard from "./components/QuestionCard";
// types
import { QuestionsState, Difficulty } from "./API";
// Styles
import { GlobalStyle, Wrapper } from "./App.styles";

const { Countdown } = Statistic;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [countdownTarget, setCountdownTarget] = useState<number>(0);
  const [deadline, setdeadline] = useState<boolean>(false);

  useEffect(() => {}, [countdownTarget, deadline]);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
    if (newQuestions) {
      setCountdownTarget(Date.now() + 10 * 1000);
   
    }
  };

  const checkAnswer = (e: any) => {
    if (!gameOver) {
      // User's answer
      const answer = e.currentTarget.value;
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if (correct) setScore((prev) => prev + 1);
      // Save the answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    setdeadline(false);
    // Move on to the next question if not the last question
    const nextQ = number + 1;

    if (nextQ === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQ);
      setCountdownTarget(Date.now() + 10 * 1000);
    }
  };

  return (
    <>
      <GlobalStyle />

      <Wrapper>
        <div className="timers">
          <h1>WORLD AFFAIRS QUIZ</h1>
          {!loading && !gameOver && (
            <div className="timer-cont">
              <Countdown
                format="mm:ss"
                prefix="Timer:"
                valueStyle={{
                  // color: "#ffffff",
                  color: `${deadline ? "red" : "#ffffff"}`,
                }}
                value={countdownTarget}
                onFinish={() => nextQuestion()}
                onChange={(e) => {
                  if (e && e <= 6000) {
                    setdeadline(true);
                  }
                }}
              />
            </div>
          )}
        </div>

        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start" onClick={startTrivia}>
            Begin Quiz
          </button>
        ) : null}
        {!gameOver ? <p className="score">Score: {score}</p> : null}
        {loading ? <p>Loading Questions...</p> : null}

        {!loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver &&
        !loading &&
        userAnswers.length === number + 1 &&
        number !== TOTAL_QUESTIONS - 1 ? (
          <button
            className="next"
            onClick={(e) => {
              // e.stopPropagation();
              setdeadline(false)
              nextQuestion();
            }}
          >
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
};

export default App;
