import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  BarChart2,
  Download
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminGradesView = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Fetch all submissions and statistics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all submitted submissions
        const submissionsRes = await axios.get('http://localhost:5000/submissions/admin/submissions', {
          params: { status: 'submitted' }
        });
        setSubmissions(submissionsRes.data);

        // Fetch statistics
        const statsRes = await axios.get('http://localhost:5000/submissions/admin/statistics');
        setStats(statsRes.data);

      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load submissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportToCSV = () => {
    // Simple CSV export implementation
    const headers = ['Quiz ID', 'Quiz Title', 'User ID', 'Username', 'Score', 'Total Points', 'Percentage', 'Submitted At'];
    const csvRows = [
      headers.join(','),
      ...submissions.map(sub => 
        [
          sub.quiz_id,
          `"${sub.quiz_title}"`,
          sub.user_id,
          `"${sub.username}"`,
          sub.score,
          sub.total_points,
          Math.round((sub.score / sub.total_points) * 100),
          new Date(sub.submitted_at).toLocaleString()
        ].join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quiz_grades.csv';
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <BarChart2 className="mr-2" size={24} />
          Quiz Results Dashboard
        </h1>
        <button 
          onClick={exportToCSV}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="mr-2" size={18} />
          Export to CSV
        </button>
      </div>

      {/* Statistics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Quizzes</h3>
            <p className="text-2xl font-bold">{stats.totalQuizzes || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Submissions</h3>
            <p className="text-2xl font-bold">{stats.totalSubmissions || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
            <p className="text-2xl font-bold">
              {stats.averageScore ? Math.round(stats.averageScore) + '%' : 'N/A'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pass Rate</h3>
            <p className="text-2xl font-bold">
              {stats.passRate ? Math.round(stats.passRate) + '%' : 'N/A'}
            </p>
          </div>
        </div>
      )}

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.length > 0 ? (
                submissions.map((submission) => {
                  const percentage = submission.total_points > 0 
                    ? Math.round((submission.score / submission.total_points) * 100)
                    : 0;
                  const isPassing = percentage >= 70;

                  return (
                    <tr key={submission.submission_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{submission.quiz_title}</div>
                        <div className="text-sm text-gray-500">ID: {submission.quiz_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{submission.username}</div>
                        <div className="text-sm text-gray-500">ID: {submission.user_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission.score} / {submission.total_points}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${isPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.submitted_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isPassing ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Passed
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiz Performance Section */}
      {stats?.quizzes?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BookOpen className="mr-2" size={20} />
            Quiz Performance Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.quizzes.map(quiz => (
              <div key={quiz.quiz_id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <div>Attempts: {quiz.attempts || 0}</div>
                  <div>Average Score: {quiz.avgScore ? Math.round(quiz.avgScore) : 'N/A'}</div>
                  <div>High Score: {quiz.highScore || 'N/A'}</div>
                  <div>Low Score: {quiz.lowScore || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGradesView;