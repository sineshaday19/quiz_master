import React, { useState, useEffect } from 'react';
import {
    ClipboardList,
    Edit,
    Trash2,
    Plus,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    XCircle,
    ArrowLeft,
    X
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuestionManagement = ({ quizId, onBack }) => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [correctOption, setCorrectOption] = useState(0);

    // Form state
    const [formData, setFormData] = useState({
        question_text: '',
        question_type: 'multiple_choice',
        points: 1,
        display_order: 1
    });

    // Fetch questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/questions/quiz/${quizId}`);
                setQuestions(response.data);
                setIsLoading(false);
            } catch (error) {
                toast.error('Failed to fetch questions');
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, [quizId]);

    // Handle edit
    const handleEdit = async (question) => {
        setCurrentQuestion(question);
        setFormData({
            question_text: question.question_text,
            question_type: question.question_type,
            points: question.points,
            display_order: question.display_order
        });

        // For multiple choice questions, fetch options
        if (question.question_type === 'multiple_choice') {
            await fetchOptions(question.question_id);
        } else {
            setOptions([]);
        }

        setShowEditModal(true);
    };

    // Fetch options for a question
    const fetchOptions = async (questionId) => {
        try {
            const response = await axios.get(`http://localhost:5000/questions/${questionId}/options`);
            if (response.data && response.data.length > 0) {
                const opts = response.data.map(opt => opt.option_text);
                const correct = response.data.findIndex(opt => opt.is_correct);
                setOptions(opts);
                setCorrectOption(correct >= 0 ? correct : 0);
            } else {
                // Initialize with empty options if none exist
                setOptions(['', '']);
                setCorrectOption(0);
            }
        } catch (error) {
            toast.error('Failed to fetch options');
            // Initialize with empty options if error occurs
            setOptions(['', '']);
            setCorrectOption(0);
        }
    };

    // Handle create
    const handleCreate = () => {
        setCurrentQuestion(null);
        setFormData({
            question_text: '',
            question_type: 'multiple_choice',
            points: 1,
            display_order: questions.length + 1
        });
        setOptions(['', '']);
        setCorrectOption(0);
        setShowCreateModal(true);
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'points' || name === 'display_order' ? parseInt(value) : value
        }));

        // Reset options if question type changes to/from multiple_choice
        if (name === 'question_type') {
            if (value === 'multiple_choice' && options.length === 0) {
                setOptions(['', '']);
                setCorrectOption(0);
            } else if (value !== 'multiple_choice') {
                setOptions([]);
            }
        }
    };

    // Handle option change
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // Add new option
    const addOption = () => {
        setOptions([...options, '']);
    };

    // Remove option
    const removeOption = (index) => {
        if (options.length <= 2) {
            toast.warning('You need at least 2 options');
            return;
        }
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
        if (correctOption >= newOptions.length) {
            setCorrectOption(newOptions.length - 1);
        } else if (correctOption >= index) {
            setCorrectOption(correctOption - 1);
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentQuestion) {
                // Update question
                await axios.put(`http://localhost:5000/questions/${currentQuestion.question_id}`, formData);

                // Update options if multiple choice
                if (formData.question_type === 'multiple_choice') {
                    await updateOptions(currentQuestion.question_id);
                } else {
                    // Delete options if question type changed from multiple_choice
                    await deleteOptions(currentQuestion.question_id);
                }

                toast.success('Question updated successfully');
            } else {
                // Create question
                const response = await axios.post('http://localhost:5000/questions', {
                    ...formData,
                    quiz_id: quizId
                });

                // Create options if multiple choice
                if (formData.question_type === 'multiple_choice') {
                    await createOptions(response.data.question_id);
                }

                toast.success('Question created successfully');
            }
            // Refresh list
            const response = await axios.get(`http://localhost:5000/questions/quiz/${quizId}`);
            setQuestions(response.data);
            setShowEditModal(false);
            setShowCreateModal(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Operation failed');
        }
    };

    // Create options for new question
    const createOptions = async (questionId) => {
        try {
            await Promise.all(
                options.map((opt, index) =>
                    axios.post(`http://localhost:5000/questions/${questionId}/options`, {
                        option_text: opt,
                        is_correct: index === correctOption
                    })
                )
            );
        } catch (error) {
            toast.error('Failed to create options');
            throw error;
        }
    };


    // Update options for existing question
    const updateOptions = async (questionId) => {
        try {
            // First delete all existing options
            await deleteOptions(questionId);

            // Then create new ones
            await createOptions(questionId);
        } catch (error) {
            toast.error('Failed to update options');
            throw error;
        }
    };

    // Delete all options for a question
    const deleteOptions = async (questionId) => {
        try {
            // Get all options for the question
            const response = await axios.get(`http://localhost:5000/questions/${questionId}/options`);
            const optionsToDelete = response.data;

            // Delete each option individually
            await Promise.all(
                optionsToDelete.map(option =>
                    axios.delete(`http://localhost:5000/questions/options/${option.option_id}`)
                )
            );
        } catch (error) {
            console.error('Error deleting options:', error);
            throw error;
        }
    };

    // Handle delete
    const handleDelete = async (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await axios.delete(`http://localhost:5000/questions/${questionId}`);
                toast.success('Question deleted successfully');
                const response = await axios.get(`http://localhost:5000/questions/quiz/${quizId}`);
                setQuestions(response.data);
            } catch (error) {
                toast.error('Failed to delete question');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
                >
                    <ArrowLeft size={20} className="mr-1" />
                    Back to Quizzes
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Question Management</h2>
                <button
                    onClick={handleCreate}
                    className="ml-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={18} className="mr-2" />
                    Add Question
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Question
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Points
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {questions.length > 0 ? (
                                questions.map((question) => (
                                    <tr key={question.question_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2">{question.question_text}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 capitalize">{question.question_type.replace('_', ' ')}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{question.points}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{question.display_order}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(question)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(question.question_id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No questions found for this quiz
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit/Create Question Modal */}
            {(showEditModal || showCreateModal) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800">
                                    {currentQuestion ? 'Edit Question' : 'Create New Question'}
                                </h3>
                                <button
                                    onClick={() => {
                                        if (currentQuestion) {
                                            setShowEditModal(false);
                                        } else {
                                            setShowCreateModal(false);
                                        }
                                    }}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text*</label>
                                        <textarea
                                            name="question_text"
                                            value={formData.question_text}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type*</label>
                                            <select
                                                name="question_type"
                                                value={formData.question_type}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            >
                                                <option value="multiple_choice">Multiple Choice</option>
                                                <option value="true_false">True/False</option>
                                                <option value="short_answer">Short Answer</option>
                                                <option value="essay">Essay</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Points*</label>
                                            <input
                                                type="number"
                                                name="points"
                                                min="1"
                                                value={formData.points}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Order*</label>
                                        <input
                                            type="number"
                                            name="display_order"
                                            min="1"
                                            value={formData.display_order}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Options for multiple choice */}
                                    {formData.question_type === 'multiple_choice' && (
                                        <div className="border-t border-gray-200 pt-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-3">Options*</h4>
                                            <div className="space-y-3">
                                                {options.map((option, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        <input
                                                            type="radio"
                                                            name="correct_option"
                                                            checked={correctOption === index}
                                                            onChange={() => setCorrectOption(index)}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={option}
                                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                            placeholder={`Option ${index + 1}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOption(index)}
                                                            className="p-2 text-red-600 hover:text-red-800"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={addOption}
                                                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-2"
                                                >
                                                    <Plus size={16} className="mr-1" />
                                                    Add another option
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => currentQuestion ? setShowEditModal(false) : setShowCreateModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        {currentQuestion ? 'Save Changes' : 'Create Question'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionManagement;