import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Clock,
    ArrowLeft,
    List,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StudentQuiz from './StudentManage';
import StudentQuizResults from './StudentResults';



export const TakeQuiz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('quizzes'); // 'quizzes', 'take-quiz', or 'view-results'
    const [submissionStatus, setSubmissionStatus] = useState({});
    const [completedQuizData, setCompletedQuizData] = useState(null);

    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const currentUserId = user?.user_id;

    // Fetch all available quizzes and their submission status
    useEffect(() => {
        const fetchQuizzesAndSubmissions = async () => {
            try {
                setIsLoading(true);

                // Fetch published quizzes
                const quizzesResponse = await axios.get('http://localhost:5000/quizzes', {
                    params: {
                        is_published: true
                    }
                });
                const quizzesData = quizzesResponse.data;

                // Fetch user submissions if currentUserId is available
                const statusMap = {};
                if (currentUserId) {
                    try {
                        const submissionsResponse = await axios.get('http://localhost:5000/submissions', {
                            params: {
                                user_id: currentUserId
                            }
                        });

                        submissionsResponse.data.forEach(submission => {
                            statusMap[submission.quiz_id] = {
                                status: submission.status,
                                submission_id: submission.submission_id,
                                score: submission.score,
                                total_points: submission.total_points
                            };
                        });

                    } catch (submissionError) {
                        console.error('Error fetching submissions:', submissionError);
                        toast.error('Failed to load submission data');
                    }
                }

                setQuizzes(quizzesData);
                setSubmissionStatus(statusMap);
            } catch (error) {
                console.error('Failed to fetch quizzes:', error);
                toast.error('Failed to fetch quizzes');
            } finally {
                setIsLoading(false);
            }
        };

        if (view === 'quizzes') {
            fetchQuizzesAndSubmissions();
        }
    }, [view, currentUserId]);

    const handleBackFromQuiz = () => {
        setView('quizzes');
        setSelectedQuizId(null);
        setCompletedQuizData(null);
    };

    const handleViewResults = async (quizId) => {
        try {
            setIsLoading(true);
            setSelectedQuizId(quizId);
            
            // Fetch all the required data for the results view
            const quizResponse = await axios.get(`http://localhost:5000/quizzes/${quizId}`);
            const questionsResponse = await axios.get(`http://localhost:5000/questions/quiz/${quizId}`);
            
            // Get the submission data
            const submissionResponse = await axios.get('http://localhost:5000/submissions', {
                params: {
                    quiz_id: quizId,
                    user_id: currentUserId
                }
            });
            
            const submission = submissionResponse.data[0];
            const answersResponse = await axios.get(`http://localhost:5000/submissions/${submission.submission_id}/answers`);
            
            // Format answers into the expected structure
            const answers = {};
            answersResponse.data.forEach(answer => {
                answers[answer.question_id] = {
                    answer_text: answer.answer_text,
                    selected_option_id: answer.selected_option_id
                };
            });
            
            // Get options for multiple choice questions
            const options = {};
            for (const question of questionsResponse.data) {
                if (question.question_type === 'multiple_choice') {
                    const optionsResponse = await axios.get(`http://localhost:5000/questions/${question.question_id}/options`);
                    options[question.question_id] = optionsResponse.data;
                }
            }
            
            // Calculate score
            const score = {
                obtained: submission.score,
                total: submission.total_points,
                percentage: submission.total_points > 0 
                    ? Math.round((submission.score / submission.total_points) * 100) 
                    : 0
            };
            
            setCompletedQuizData({
                quiz: quizResponse.data,
                questions: questionsResponse.data,
                answers,
                options,
                score
            });
            
            setView('view-results');
        } catch (error) {
            console.error('Failed to load quiz results:', error);
            toast.error('Failed to load quiz results');
        } finally {
            setIsLoading(false);
        }
    };

    const getQuizStatus = (quizId) => {
        const status = submissionStatus[quizId]?.status;
        const score = submissionStatus[quizId]?.score;
        const total = submissionStatus[quizId]?.total_points;

        if (!status) return null;

        if (status === 'submitted') {
            const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
            return {
                text: `Scored ${score}/${total} (${percentage}%)`,
                color: percentage >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            };
        }

        return {
            text: 'In Progress',
            color: 'bg-blue-100 text-blue-800'
        };
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
                <p className="text-gray-600">Loading quizzes...</p>
            </div>
        );
    }

    if (view === 'take-quiz' && selectedQuizId) {
        return (
            <StudentQuiz
                quizId={selectedQuizId}
                userId={currentUserId}
                onBack={handleBackFromQuiz}
            />
        );
    }

    if (view === 'view-results' && completedQuizData) {
        return (
            <StudentQuizResults
                quiz={completedQuizData.quiz}
                questions={completedQuizData.questions}
                answers={completedQuizData.answers}
                options={completedQuizData.options}
                score={completedQuizData.score}
                onBack={handleBackFromQuiz}
            />
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Available Quizzes</h2>
                <div className="text-sm text-gray-500">
                    Logged in as: {user?.username || 'Guest'}
                </div>
            </div>

            {quizzes.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No quizzes available</h3>
                    <p className="mt-1 text-gray-500">There are currently no active quizzes to take.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map(quiz => {
                        const status = getQuizStatus(quiz.quiz_id);
                        const isCompleted = submissionStatus[quiz.quiz_id]?.status === 'submitted';
                        const isInProgress = submissionStatus[quiz.quiz_id]?.status === 'in_progress';

                        return (
                            <div key={quiz.quiz_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                                <div className="p-6 flex-grow">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-800">{quiz.title}</h3>
                                        {status && (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                                {status.text}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-2 text-gray-600 line-clamp-2">{quiz.description}</p>

                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="mr-1.5 h-4 w-4 flex-shrink-0" />
                                            <span>Time limit: {quiz.time_limit_minutes || 'No'} minutes</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-500">
                                            <List className="mr-1.5 h-4 w-4 flex-shrink-0" />
                                            <span>{quiz.question_count || 'Unknown'} questions</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            if (isCompleted) {
                                                handleViewResults(quiz.quiz_id);
                                            } else {
                                                setSelectedQuizId(quiz.quiz_id);
                                                setView('take-quiz');
                                            }
                                        }}
                                        className={`w-full px-4 py-2 rounded-lg transition-colors ${isCompleted
                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                : isInProgress
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                    >
                                        {isCompleted
                                            ? 'View Results'
                                            : isInProgress
                                                ? 'Continue Quiz'
                                                : 'Start Quiz'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};