import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  BookOpen, 
  ArrowLeft,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentQuiz = ({ quizId, userId, onBack }) => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState({}); // Stores options for each question
  const [submission, setSubmission] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [timer, setTimer] = useState(null);

  // Fetch quiz details, questions, and options
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch quiz details
        const quizResponse = await axios.get(`http://localhost:5000/quizzes/${quizId}`);
        setQuiz(quizResponse.data);
        
        // Set initial time left if there's a time limit
        if (quizResponse.data.time_limit_minutes) {
          setTimeLeft(quizResponse.data.time_limit_minutes * 60);
        }

        // Fetch questions
        const questionsResponse = await axios.get(`http://localhost:5000/questions/quiz/${quizId}`);
        setQuestions(questionsResponse.data);
        
        // Fetch options for all multiple choice questions
        const optionsMap = {};
        for (const question of questionsResponse.data) {
          if (question.question_type === 'multiple_choice') {
            const optionsResponse = await axios.get(`http://localhost:5000/questions/${question.question_id}/options`);
            optionsMap[question.question_id] = optionsResponse.data;
          }
        }
        setOptions(optionsMap);

        // Check for existing in-progress submission
        try {
          const submissionResponse = await axios.get(
            `http://localhost:5000/submissions?quiz_id=${quizId}&user_id=${userId}`
          );
          
          if (submissionResponse.data && submissionResponse.data.status === 'in_progress') {
            setSubmission(submissionResponse.data);
            
            // Load existing answers
            const answersResponse = await axios.get(
              `http://localhost:5000/submissions/${submissionResponse.data.submission_id}/answers`
            );
            const existingAnswers = {};
            answersResponse.data.forEach(answer => {
              existingAnswers[answer.question_id] = {
                answer_text: answer.answer_text,
                selected_option_id: answer.selected_option_id
              };
            });
            setAnswers(existingAnswers);
          }
        } catch (submissionError) {
          console.log('No existing submission found');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load quiz data:', error);
        toast.error('Failed to load quiz data');
        setIsLoading(false);
      }
    };

    fetchQuizData();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizId, userId]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || !submission || submission.status !== 'in_progress') return;

    const newTimer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(newTimer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimer(newTimer);

    return () => clearInterval(newTimer);
  }, [timeLeft, submission]);

  const handleTimeExpired = async () => {
    toast.warning('Time is up! Submitting your quiz...');
    await submitQuiz();
  };

  // Start a new quiz attempt
  const startQuiz = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/submissions', {
        quiz_id: quizId,
        user_id: userId
      });
      setSubmission(response.data);
      setIsLoading(false);
      toast.success('Quiz started!');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Resume existing quiz
        setSubmission({
          submission_id: error.response.data.submission_id,
          status: 'in_progress'
        });
        toast.info('Resuming your in-progress quiz');
      } else {
        toast.error('Failed to start quiz');
      }
      setIsLoading(false);
    }
  };

  // Handle answer change
  const handleAnswerChange = (questionId, value, isOption = false) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [isOption ? 'selected_option_id' : 'answer_text']: value
      }
    }));
  };

  // Save answer to server
  const saveAnswer = async (questionId) => {
    if (!submission) return;

    const answer = answers[questionId] || {};
    
    try {
      await axios.post(
        `http://localhost:5000/submissions/${submission.submission_id}/answers`,
        {
          question_id: questionId,
          answer_text: answer.answer_text,
          selected_option_id: answer.selected_option_id
        }
      );
    } catch (error) {
      console.error('Failed to save answer:', error);
    }
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Save current answer before moving
      saveAnswer(questions[currentQuestionIndex].question_id);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Move to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit the entire quiz
  const submitQuiz = async () => {
    if (!submission) return;

    try {
      setIsSubmitting(true);
      
      // Save current answer
      saveAnswer(questions[currentQuestionIndex].question_id);
      
      // Complete submission
      await axios.put(
        `http://localhost:5000/submissions/${submission.submission_id}/complete`
      );
      
      // Get results
      const resultsResponse = await axios.get(
        `http://localhost:5000/submissions/${submission.submission_id}`
      );
      
      setSubmission(resultsResponse.data.submission);
      
      // Calculate score (simplified - in a real app, this should come from the backend)
      let totalScore = 0;
      let maxScore = 0;
      
      questions.forEach(question => {
        maxScore += question.points || 0;
        
        const answer = answers[question.question_id];
        if (!answer) return;
        
        if (question.question_type === 'multiple_choice') {
          // Check if selected option is correct
          const selectedOption = options[question.question_id]?.find(
            opt => opt.option_id === answer.selected_option_id
          );
          if (selectedOption?.is_correct) {
            totalScore += question.points || 0;
          }
        } else {
          // For other types, we can't auto-grade, so we'll assume partial credit
          if (answer.answer_text && answer.answer_text.trim().length > 0) {
            totalScore += question.points ? question.points / 2 : 0;
          }
        }
      });
      
      setScore({
        obtained: totalScore,
        total: maxScore,
        percentage: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
      });
      
      setShowResults(true);
      toast.success('Quiz submitted successfully!');
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Quiz not found</h3>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          
          <div className="flex items-center text-gray-500 mb-6">
            <Clock className="mr-2" size={18} />
            <span>Time limit: {quiz.time_limit_minutes || 'No'} minutes</span>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Instructions</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>This quiz contains {questions.length} questions</li>
              {quiz.time_limit_minutes && <li>You have {quiz.time_limit_minutes} minutes to complete</li>}
              <li>You can navigate between questions</li>
              <li>Answers are saved automatically</li>
              <li>Once submitted, you cannot change your answers</li>
            </ul>
          </div>
          
          <button
            onClick={startQuiz}
            className="mt-6 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults && score) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
            >
              <ArrowLeft size={20} className="mr-1" />
              Back to Quizzes
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Quiz Results</h2>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{quiz.title}</h3>
                <p className="text-gray-600">Submitted on: {new Date(submission.submitted_at).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {score.obtained}/{score.total} ({score.percentage}%)
                </div>
                <div className={`text-sm font-medium ${score.percentage >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                  {score.percentage >= 70 ? 'Passed' : 'Failed'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {questions.map((question, qIndex) => {
              const answer = answers[question.question_id] || {};
              let isCorrect = false;
              let correctAnswer = null;
              
              if (question.question_type === 'multiple_choice') {
                const correctOption = options[question.question_id]?.find(opt => opt.is_correct);
                isCorrect = correctOption?.option_id === answer.selected_option_id;
                correctAnswer = correctOption?.option_text;
              } else {
                // For non-MCQ, we can't determine correctness automatically
                isCorrect = null;
              }
              
              return (
                <div key={question.question_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    {isCorrect !== null && (
                      <div className={`flex-shrink-0 h-5 w-5 rounded-full mt-1 mr-3 ${
                        isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {isCorrect ? <Check size={16} /> : <X size={16} />}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          Question {qIndex + 1}: {question.question_text}
                        </h4>
                        <span className="text-sm font-medium text-gray-500">
                          {question.points} {question.points === 1 ? 'point' : 'points'}
                        </span>
                      </div>
                      
                      {question.question_type === 'multiple_choice' ? (
                        <div className="mt-3 space-y-2">
                          <p className="text-sm font-medium text-gray-600">Your answer:</p>
                          <p className="text-sm bg-gray-50 p-2 rounded">
                            {options[question.question_id]?.find(
                              opt => opt.option_id === answer.selected_option_id
                            )?.option_text || 'No answer provided'}
                          </p>
                          {!isCorrect && correctAnswer && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-600">Correct answer:</p>
                              <p className="text-sm bg-green-50 p-2 rounded text-green-800">
                                {correctAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-600">Your answer:</p>
                          <p className="mt-1 text-sm bg-gray-50 p-2 rounded">
                            {answer.answer_text || 'No answer provided'}
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            (This question requires manual grading)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.question_id] || {};

  if (!currentQuestion) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No questions found for this quiz</h3>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Quiz header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={18} className="mr-1" />
              Back
            </button>
            {timeLeft !== null && (
              <div className="flex items-center text-sm font-medium text-gray-500">
                <Clock className="mr-1" size={16} />
                Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            )}
            <div className="text-sm font-medium text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          <h2 className="mt-2 text-xl font-bold text-gray-800">{quiz.title}</h2>
        </div>
        
        {/* Question content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {currentQuestion.question_text}
            </h3>
            <span className="text-sm font-medium text-gray-500">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
            </span>
          </div>
          
          {currentQuestion.question_type === 'multiple_choice' ? (
            <div className="space-y-3">
              {options[currentQuestion.question_id]?.map((option) => (
                <div key={option.option_id} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${option.option_id}`}
                    name={`question-${currentQuestion.question_id}`}
                    checked={currentAnswer.selected_option_id === option.option_id}
                    onChange={() => handleAnswerChange(currentQuestion.question_id, option.option_id, true)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor={`option-${option.option_id}`}
                    className="ml-3 block text-gray-700"
                  >
                    {option.option_text}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <textarea
              value={currentAnswer.answer_text || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.question_id, e.target.value)}
              onBlur={() => saveAnswer(currentQuestion.question_id)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type your answer here..."
            />
          )}
        </div>
        
        {/* Navigation */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg ${currentQuestionIndex === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
          >
            Previous
          </button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
      
      {/* Question progress */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Quiz Progress</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                saveAnswer(questions[currentQuestionIndex].question_id);
                setCurrentQuestionIndex(index);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentQuestionIndex === index 
                  ? 'bg-blue-600 text-white' 
                  : answers[questions[index].question_id] 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;