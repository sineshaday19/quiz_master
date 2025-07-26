import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  X,
  User
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuestionManagement from './QuestionMa';


const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    created_by: '',
    time_limit_minutes: 30,
    is_published: false
  });

  // Fetch current user and quizzes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
        
        // Set created_by in form data
        setFormData(prev => ({
          ...prev,
          created_by: user?.user_id || ''
        }));

        // Fetch quizzes
        const response = await axios.get('http://localhost:5000/quizzes');
        setQuizzes(response.data);
        setFilteredQuizzes(response.data);
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to fetch data');
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter quizzes
  useEffect(() => {
    const filtered = quizzes.filter(quiz => 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.created_by && quiz.created_by.toString().includes(searchTerm))
    );
    setFilteredQuizzes(filtered);
  }, [searchTerm, quizzes]);

  // Sort quizzes
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredQuizzes(sortedQuizzes);
  };

  // Handle edit
  const handleEdit = (quiz) => {
    setCurrentQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      created_by: quiz.created_by,
      time_limit_minutes: quiz.time_limit_minutes,
      is_published: quiz.is_published
    });
    setShowEditModal(true);
  };

  // Handle create
  const handleCreate = () => {
    if (!currentUser) {
      toast.error('You must be logged in to create a quiz');
      return;
    }
    
    setCurrentQuiz(null);
    setFormData({
      title: '',
      description: '',
      created_by: currentUser.user_id,
      time_limit_minutes: 30,
      is_published: false
    });
    setShowCreateModal(true);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.created_by) {
      toast.error('Title and creator are required');
      return;
    }

    try {
      if (currentQuiz) {
        // Update quiz
        await axios.put(`http://localhost:5000/quizzes/${currentQuiz.quiz_id}`, formData);
        toast.success('Quiz updated successfully');
      } else {
        // Create quiz
        const response = await axios.post('http://localhost:5000/quizzes', formData);
        toast.success('Quiz created successfully');
        // Immediately show questions for the new quiz
        setSelectedQuizId(response.data.quiz_id);
        setShowQuestions(true);
      }
      // Refresh list
      const response = await axios.get('http://localhost:5000/quizzes');
      setQuizzes(response.data);
      setShowEditModal(false);
      setShowCreateModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  // Handle delete
  const handleDelete = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz and all its questions?')) {
      try {
        await axios.delete(`http://localhost:5000/quizzes/${quizId}`);
        toast.success('Quiz deleted successfully');
        const response = await axios.get('http://localhost:5000/quizzes');
        setQuizzes(response.data);
      } catch (error) {
        toast.error('Failed to delete quiz');
      }
    }
  };

  // Toggle publish status
  const togglePublish = async (quizId, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/quizzes/${quizId}`, {
        is_published: !currentStatus
      });
      toast.success(`Quiz ${currentStatus ? 'unpublished' : 'published'}`);
      const response = await axios.get('http://localhost:5000/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      toast.error('Failed to update quiz status');
    }
  };

  // Render sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp size={16} className="ml-1" /> : 
      <ChevronDown size={16} className="ml-1" />;
  };

  if (showQuestions && selectedQuizId) {
    return (
      <QuestionManagement 
        quizId={selectedQuizId} 
        onBack={() => setShowQuestions(false)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Quiz Management</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search quizzes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={!currentUser}
            className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
              currentUser 
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus size={18} className="mr-2" />
            Create Quiz
          </button>
        </div>
      </div>

      {quizzes.length === 0 && !isLoading ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first quiz</p>
          <button
            onClick={handleCreate}
            disabled={!currentUser}
            className={`px-4 py-2 rounded-lg ${
              currentUser 
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Create New Quiz
          </button>
          {!currentUser && (
            <p className="mt-2 text-sm text-red-500">You must be logged in to create quizzes</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      {renderSortIcon('title')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('time_limit_minutes')}
                  >
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      Time Limit
                      {renderSortIcon('time_limit_minutes')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('created_by')}
                  >
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      Creator
                      {renderSortIcon('created_by')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('is_published')}
                  >
                    Status
                    {renderSortIcon('is_published')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuizzes.map((quiz) => (
                  <tr key={quiz.quiz_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">{quiz.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {quiz.time_limit_minutes} mins
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {quiz.created_by}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        onClick={() => togglePublish(quiz.quiz_id, quiz.is_published)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                          quiz.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {quiz.is_published ? (
                          <span className="flex items-center">
                            <CheckCircle size={14} className="mr-1" /> Published
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <XCircle size={14} className="mr-1" /> Draft
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedQuizId(quiz.quiz_id);
                          setShowQuestions(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Manage Questions"
                      >
                        <BookOpen size={18} />
                      </button>
                      {currentUser?.user_id === quiz.created_by && (
                        <>
                          <button
                            onClick={() => handleEdit(quiz)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(quiz.quiz_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Quiz Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Edit Quiz</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Creator User ID*</label>
                    <input
                      type="number"
                      name="created_by"
                      value={formData.created_by}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)*</label>
                    <input
                      type="number"
                      name="time_limit_minutes"
                      min="1"
                      value={formData.time_limit_minutes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_published"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
                      Publish this quiz
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Create New Quiz</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Creator User ID*</label>
                    <input
                      type="number"
                      name="created_by"
                      value={formData.created_by}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)*</label>
                    <input
                      type="number"
                      name="time_limit_minutes"
                      min="1"
                      value={formData.time_limit_minutes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_published"
                      name="is_published"
                      checked={formData.is_published}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
                      Publish this quiz
                    </label>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Quiz
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

export default QuizManagement;