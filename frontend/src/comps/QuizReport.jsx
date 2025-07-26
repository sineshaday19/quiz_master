import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Users, 
  BookOpen, 
  Award, 
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminReportsDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    quiz_id: '',
    user_id: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Redirect non-admins
  if (!user?.is_admin) {
    window.location.href = '/';
    return null;
  }

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesRes, usersRes, submissionsRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/quizzes'),
          axios.get('http://localhost:5000/users'), // Add this endpoint to your backend
          axios.get('http://localhost:5000/admin/submissions', { 
            params: {
              ...filters,
              // Always filter by current admin's user_id for their view
              admin_id: user.user_id 
            }
          }),
          axios.get('http://localhost:5000/admin/statistics', {
            params: {
              admin_id: user.user_id
            }
          })
        ]);
        
        setQuizzes(quizzesRes.data);
        setAllUsers(usersRes.data);
        setSubmissions(submissionsRes.data);
        setStats(statsRes.data);
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to load reports');
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filters, user.user_id]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const exportToCSV = () => {
    toast.info('Exporting to CSV...');
    // Actual CSV export implementation would go here
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Performance Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Logged in as: {user.first_name} {user.last_name} (Admin)
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={18} className="mr-2" />
            Filters {showFilters ? <ChevronUp size={18} className="ml-1" /> : <ChevronDown size={18} className="ml-1" />}
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download size={18} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz</label>
            <select
              name="quiz_id"
              value={filters.quiz_id}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Quizzes</option>
              {quizzes.map(quiz => (
                <option key={quiz.quiz_id} value={quiz.quiz_id}>
                  {quiz.title} (ID: {quiz.quiz_id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <select
              name="user_id"
              value={filters.user_id}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Students</option>
              {allUsers.filter(u => !u.is_admin).map(user => (
                <option key={user.user_id} value={user.user_id}>
                  {user.first_name} {user.last_name} (ID: {user.user_id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All</option>
              <option value="submitted">Submitted</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Quizzes</p>
                <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Score</p>
                <p className="text-2xl font-bold">{Math.round(stats.averageScore || 0)}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pass Rate</p>
                <p className="text-2xl font-bold">{Math.round(stats.passRate || 0)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Performance Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.submission_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium text-gray-900">{submission.first_name} {submission.last_name}</p>
                        <p className="text-sm text-gray-500">ID: {submission.user_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-gray-900">{submission.quiz_title}</p>
                    <p className="text-sm text-gray-500">ID: {submission.quiz_id}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (submission.score / submission.total_points) >= 0.7 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {submission.score}/{submission.total_points}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      submission.status === 'submitted' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsDashboard;