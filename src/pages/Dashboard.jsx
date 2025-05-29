import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Ticket, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    cancelled: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ticketsResponse] = await Promise.all([
        axios.get('/api/tickets?limit=5')
      ]);

      const tickets = ticketsResponse.data.tickets;
      setRecentTickets(tickets);

      // Calculate stats
      const statsData = {
        total: ticketsResponse.data.pagination.total,
        open: 0,
        inProgress: 0,
        resolved: 0,
        cancelled: 0
      };

      // This would be better done on the backend
      const allTickets = await axios.get('/api/tickets?limit=1000');
      allTickets.data.tickets.forEach(ticket => {
        if (ticket.status === 'open') statsData.open++;
        else if (ticket.status === 'in-progress') statsData.inProgress++;
        else if (ticket.status === 'resolved') statsData.resolved++;
        else if (ticket.status === 'cancelled') statsData.cancelled++;
      });

      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Open', value: stats.open, color: '#3B82F6' },
    { name: 'In Progress', value: stats.inProgress, color: '#F59E0B' },
    { name: 'Resolved', value: stats.resolved, color: '#10B981' },
    { name: 'Cancelled', value: stats.cancelled, color: '#EF4444' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telegram-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.firstName || user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {user?.role === 'user' ? 'Track your support tickets' : 'Manage support tickets'}
          </p>
        </div>
        {user?.role === 'user' && (
          <Link to="/tickets/new" className="btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Ticket
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Ticket className="h-8 w-8 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
              <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </motion.div>
      </div>

      {/* Chart and Recent Tickets */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Ticket Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Tickets */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Recent Tickets</h2>
          <div className="space-y-3">
            {recentTickets.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No tickets yet
              </p>
            ) : (
              recentTickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/tickets/${ticket._id}`}
                  className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{ticket.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {ticket.ticketId} • {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusIcon(ticket.status)}
                  </div>
                </Link>
              ))
            )}
          </div>
          {recentTickets.length > 0 && (
            <Link
              to="/tickets"
              className="block text-center text-sm text-telegram-blue hover:underline mt-4"
            >
              View all tickets
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;