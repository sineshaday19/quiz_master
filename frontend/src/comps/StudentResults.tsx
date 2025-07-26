import React from 'react';
import { CheckCircle, XCircle, BookOpen, ArrowLeft } from 'lucide-react';

const StudentQuizResults = ({ quiz, questions, answers, options, score, onBack }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
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
        
        {/* Quiz summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{quiz.title}</h3>
              <p className="text-gray-600">{quiz.description}</p>
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
        
        {/* Detailed results */}
        <div className="space-y-6">
          {questions.map((question, qIndex) => {
            const answer = answers[question.question_id] || {};
            let isCorrect = false;
            let correctAnswer = null;
            
            if (question.question_type === 'multiple_choice') {
              const correctOption = options[question.question_id]?.find(opt => opt.is_correct);
              isCorrect = correctOption?.option_id === answer.selected_option_id;
              correctAnswer = correctOption?.option_text;
            }
            
            return (
              <div key={question.question_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  {question.question_type === 'multiple_choice' && (
                    <div className={`flex-shrink-0 h-5 w-5 rounded-full mt-1 mr-3 ${
                      isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
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
                        <p className={`text-sm p-2 rounded ${
                          isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
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
        
        {/* Additional feedback */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback</h3>
          {score.percentage >= 90 ? (
            <p className="text-green-700">Excellent work! You've demonstrated a strong understanding of the material.</p>
          ) : score.percentage >= 70 ? (
            <p className="text-green-600">Good job! You've passed the quiz with a solid score.</p>
          ) : score.percentage >= 50 ? (
            <p className="text-yellow-600">You're getting there! Review the material and try again.</p>
          ) : (
            <p className="text-red-600">Consider reviewing the material and retaking the quiz to improve your score.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentQuizResults;