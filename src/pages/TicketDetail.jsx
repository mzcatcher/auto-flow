import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, User, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`/api/tickets/${id}`);
      setTicket(response.data.ticket);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.patch(`/api/tickets/${id}`, { status: newStatus });
      setTicket(response.data.ticket);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const response = await axios.post(`/api/tickets/${id}/comments`, {
        message: comment
      });
      setTicket(response.data.ticket);
      setComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telegram-blue"></div>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  const canManageTicket = user?.role === 'admin' || user?.role === 'super-admin';

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/tickets')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {ticket.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {ticket.ticketId}
          </p>
        </div>
        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(ticket.status)}`}>
          {ticket.status.replace('-', ' ')}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h2 className="font-semibold mb-3">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {ticket.description}
            </p>

            {ticket.screenshots?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Attachments
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {ticket.screenshots.map((screenshot, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded flex items-center gap-2"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="text-sm">Screenshot {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h2 className="font-semibold mb-4">Comments</h2>
            
            <div className="space-y-4 mb-6">
              {ticket.comments?.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No comments yet
                </p>
              ) : (
                ticket.comments?.map((comment, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {comment.user?.username || 'Unknown'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-telegram-blue"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </form>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-6"
          >
            <h2 className="font-semibold mb-4">Details</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                  <p className="capitalize">{ticket.type.replace('-', ' ')}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created by</p>
                  <p>{ticket.createdBy?.username}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                  <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {ticket.assignedTo && (
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Assigned to</p>
                    <p>{ticket.assignedTo.username}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          {canManageTicket && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h2 className="font-semibold mb-4">Actions</h2>
              
              <div className="space-y-2">
                {ticket.status !== 'in-progress' && (
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    className="w-full btn-secondary text-sm"
                  >
                    Mark as In Progress
                  </button>
                )}
                {ticket.status !== 'resolved' && (
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className="w-full btn-secondary text-sm text-green-600"
                  >
                    Mark as Resolved
                  </button>
                )}
                {ticket.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="w-full btn-secondary text-sm text-red-600"
                  >
                    Cancel Ticket
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;