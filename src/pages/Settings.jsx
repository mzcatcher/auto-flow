import React from 'react';
import { Moon, Sun, Bell, Shield, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Username</p>
            <p className="font-medium">@{user?.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Telegram ID</p>
            <p className="font-medium">{user?.telegramId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
            <p className="font-medium capitalize">{user?.role.replace('-', ' ')}</p>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toggle dark mode theme
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              isDark ? 'bg-telegram-blue' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                isDark ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications via Telegram
                </p>
              </div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-telegram-blue">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium">Security Alerts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified about security events
                </p>
              </div>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-telegram-blue">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold mb-4">About</h2>
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Telegram Support System v1.0.0</p>
            <p className="mt-2">
              A comprehensive support ticket management system integrated with Telegram.
            </p>
            <p className="mt-2">
              © 2025 All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;