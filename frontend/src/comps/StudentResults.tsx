import React, { useState, useEffect } from 'react';
import { 
  CheckCircle,
  XCircle,
  BookOpen,
  Clock,
  List,
  ArrowLeft,
  BarChart2,
  Award,
  Percent,
  HelpCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuizResults = ({ submissionId, onBack }) => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/submissions/${submissionId}`);
        
        // Transform answers to include question type specific data
        const transformedAnswers = response.data.answers.map(answer => {
          let isCorrect = false;
          let correctAnswer = null;
          
          if (answer.question_type === 'multiple_choice') {
            isCorrect = answer.selected_option_id === answer.correct_option_id;
            correctAnswer = answer.correct_option_text;
          } else if (answer.question_type === 'true_false') {
            // For true/false questions, compare with correct_answer from backend
            isCorrect = answer.answer_text?.toLowerCase() === answer.correct_answer?.toLowerCase();
            correctAnswer = answer.correct_answer;
          }
          // For short_answer/essay, isCorrect will remain false unless manually graded
          
          return {
            ...answer,
            is_correct: isCorrect,
            correct_answer: correctAnswer
          };
        });

        setResults({
          ...response.data,
          answers: transformedAnswers
        });
      } catch (error) {
        console.error('Failed to fetch results:', error);
        toast.error('Failed to load quiz results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [submissionId]);

  const toggleQuestionExpand = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading your results...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="p-6 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Results not found</h3>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  const { submission, answers } = results;
  const percentage = submission.total_points > 0 
    ? Math.round((submission.score / submission.total_points) * 100) 
    : 0;
  const passed = percentage >= 70;

  // Calculate question statistics
  const correctCount = answers.filter(a => a.is_correct).length;
  const totalQuestions = answers.length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
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

      {/* Summary Card */}
      <div className={`rounded-xl p-6 mb-6 ${passed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{submission.quiz_title}</h3>
            <p className="text-gray-600">
              Submitted on: {new Date(submission.submitted_at).toLocaleString()}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center justify-end space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {correctCount}/{totalQuestions}
                </div>
                <div className="text-sm text-gray-500">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {submission.score}/{submission.total_points}
                </div>
                <div className="text-sm text-gray-500">Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {percentage}%
                </div>
                <div className={`text-sm font-medium ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {passed ? 'Passed' : 'Failed'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium">Performance</span>
          </div>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
            <div 
              className={`h-2 rounded-full ${passed ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {percentage}% correct ({correctCount} of {totalQuestions})
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Award className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium">Passing Grade</span>
          </div>
          <div className="mt-2 text-xl font-bold">70%</div>
          <div className="mt-1 text-sm text-gray-500">
            Minimum score required
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Percent className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium">Your Score</span>
          </div>
          <div className={`mt-2 text-xl font-bold ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
            {percentage}%
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {passed ? 'You passed!' : 'Keep practicing!'}
          </div>
        </div>
      </div>

      {/* Questions Breakdown */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Questions Breakdown</h3>
          <p className="text-sm text-gray-500 mt-1">
            Review your answers and see where you did well or need improvement
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {answers.map((answer, index) => {
            const isCorrect = answer.is_correct;
            const isExpanded = expandedQuestions[answer.question_id];
            const isAutoGraded = ['multiple_choice', 'true_false'].includes(answer.question_type);

            return (
              <div key={answer.answer_id} className="p-6">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full mt-1 mr-3 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Question {index + 1}: {answer.question_text}
                      </h4>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 mr-2">
                          {answer.points_earned || 0}/{answer.question_points} pts
                        </span>
                        {!isAutoGraded && (
                          <HelpCircle className="h-4 w-4 text-gray-400" title="Requires manual grading" />
                        )}
                      </div>
                    </div>

                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Your answer:</p>
                        <p className="mt-1 text-sm bg-gray-50 p-2 rounded">
                          {answer.answer_text || answer.selected_option_text || 'No answer provided'}
                        </p>
                      </div>

                      {!isCorrect && answer.correct_answer && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Correct answer:</p>
                          <p className="mt-1 text-sm bg-green-50 p-2 rounded text-green-800">
                            {answer.correct_answer}
                          </p>
                        </div>
                      )}

                      {answer.feedback && (
                        <div className={`${isExpanded ? 'block' : 'hidden'}`}>
                          <p className="text-sm font-medium text-gray-600">Feedback:</p>
                          <div className="mt-1 p-3 bg-blue-50 rounded text-sm text-blue-800">
                            {answer.feedback}
                          </div>
                        </div>
                      )}

                      {answer.feedback && (
                        <button
                          onClick={() => toggleQuestionExpand(answer.question_id)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {isExpanded ? 'Hide feedback' : 'Show feedback'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Next Steps</h3>
        {passed ? (
          <>
            <p className="text-blue-700 mb-2">
              Congratulations on passing this quiz! Here's what you can do next:
            </p>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>Review any incorrect answers to strengthen your understanding</li>
              <li>Explore more advanced topics in this subject</li>
              <li>Help your classmates who might be struggling</li>
            </ul>
          </>
        ) : (
          <>
            <p className="text-blue-700 mb-2">
              You didn't pass this time, but here's how you can improve:
            </p>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>Review the correct answers for questions you missed</li>
              <li>Study the related material before retaking the quiz</li>
              <li>Ask your instructor for clarification on difficult concepts</li>
              <li>Practice with similar questions to build your skills</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizResults;