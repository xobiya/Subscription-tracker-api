import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { User, Bell, Shield, CreditCard, Download, Camera, Save, X, Plus } from 'lucide-react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export default function ProfileView({
  user,
  activeTab,
  setActiveTab,
  isEditing,
  setIsEditing,
  form,
  setForm,
  handleSave,
  handleCancel,
  notificationForm,
  setNotificationForm,
  notificationSaving,
  handleNotificationSave,
  notificationFeedback,
  dayOptions = [1, 2, 3, 5, 7, 14],
}) {
  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ]

  const channelOptions = [
    {
      id: 'email',
      label: 'Email reminders',
      description: 'Receive renewal notifications via email',
    },
    {
      id: 'sms',
      label: 'SMS reminders',
      description: 'Get a text before your subscription renews',
    },
    {
      id: 'push',
      label: 'Push alerts',
      description: 'Surface reminders in your browser or device',
    },
  ]

  const toggleChannel = (channelId) => {
    const current = notificationForm.channels || []
    const exists = current.includes(channelId)
    const next = exists ? current.filter((item) => item !== channelId) : [...current, channelId]
    setNotificationForm({
      ...notificationForm,
      channels: next.length ? next : ['email'],
    })
  }

  const toggleDay = (day) => {
    const current = notificationForm.daysBefore || []
    const exists = current.includes(day)
    const next = exists ? current.filter((item) => item !== day) : [...current, day]
    if (!next.length) return
    setNotificationForm({
      ...notificationForm,
      daysBefore: next.sort((a, b) => b - a),
    })
  }

  const UserAvatar = ({ size = 'lg' }) => {
    const sizeClasses = {
      sm: 'w-16 h-16 text-lg',
      md: 'w-20 h-20 text-xl',
      lg: 'w-32 h-32 text-2xl',
    }

    return (
      <div className="relative group">
        <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}>
          {user?.username?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        {isEditing && (
          <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Camera className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="p-6 lg:col-span-1 border-0 shadow-lg">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                )
              })}
            </div>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="p-6 border-0 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                      <p className="text-gray-600">Update your personal details</p>
                    </div>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline" className="border-gray-300">
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleCancel} variant="outline" className="border-gray-300">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex flex-col items-center gap-4">
                      <UserAvatar />
                      {isEditing && <p className="text-sm text-gray-500 text-center">Click the camera icon to update your photo</p>}
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={!isEditing} placeholder="Enter your full name" />
                      <Input label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} disabled={!isEditing} placeholder="Choose a username" />
                      <Input label="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!isEditing} placeholder="your@email.com" />
                      <Input label="Phone Number" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={!isEditing} placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="p-6 border-0 shadow-lg space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                      <p className="text-gray-600">Choose which channels and reminders you want to receive.</p>
                    </div>
                    <Button onClick={handleNotificationSave} disabled={notificationSaving}>
                      {notificationSaving ? 'Saving...' : 'Save preferences'}
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 font-medium text-gray-700">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={notificationForm?.enabled}
                        onChange={(event) => setNotificationForm({ ...notificationForm, enabled: event.target.checked })}
                      />
                      Enable reminders
                    </label>
                    <span className="text-sm text-gray-500">Toggle reminders when you want a quiet week.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {channelOptions.map((channel) => {
                      const active = notificationForm?.channels?.includes(channel.id)
                      return (
                        <button
                          key={channel.id}
                          type="button"
                          onClick={() => toggleChannel(channel.id)}
                          className={`p-4 rounded-xl border transition-colors ${active ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <p className="text-sm font-semibold text-gray-900">{channel.label}</p>
                          <p className="text-xs text-gray-500 mt-1">{channel.description}</p>
                        </button>
                      )
                    })}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Notify me before renewals:</p>
                    <div className="flex flex-wrap gap-2">
                      {dayOptions.map((day) => {
                        const selected = notificationForm?.daysBefore?.includes(day)
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`px-4 py-2 rounded-full text-sm transition-colors border ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                          >
                            {day} day{day === 1 ? '' : 's'}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {notificationForm?.channels?.includes('sms') && (
                    <Input
                      label="SMS Number"
                      value={notificationForm.smsNumber}
                      onChange={(event) => setNotificationForm({ ...notificationForm, smsNumber: event.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  )}

                  {notificationForm?.channels?.includes('push') && (
                    <Input
                      label="Push endpoint"
                      value={notificationForm.pushEndpoint}
                      onChange={(event) => setNotificationForm({ ...notificationForm, pushEndpoint: event.target.value })}
                      placeholder="https://example.com/push-token"
                    />
                  )}

                  {notificationFeedback && (
                    <div
                      className={`text-sm font-medium ${notificationFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}
                    >
                      {notificationFeedback.message}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <Card className="p-6 border-0 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Change Password</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Current Password" type="password" placeholder="Enter current password" />
                    <Input label="New Password" type="password" placeholder="Enter new password" />
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">Update Password</Button>
                  </div>
                </Card>

                <Card className="p-6 border-0 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Two-Factor Authentication</h2>
                  <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline" className="border-gray-300">Enable 2FA</Button>
                </Card>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <Card className="p-6 border-0 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Billing History</h2>
                  <p className="text-gray-600 mb-4">Download your billing records</p>
                  <Button variant="outline" className="border-gray-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export Billing Data
                  </Button>
                </Card>

                <Card className="p-6 border-0 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center">
                          <CreditCard className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/2024</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-300">Edit</Button>
                    </div>
                  </div>
                  <Button variant="outline" className="border-gray-300 mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ProfileView.propTypes = {
  user: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  notificationForm: PropTypes.shape({
    enabled: PropTypes.bool,
    channels: PropTypes.arrayOf(PropTypes.string),
    daysBefore: PropTypes.arrayOf(PropTypes.number),
    smsNumber: PropTypes.string,
    pushEndpoint: PropTypes.string,
  }).isRequired,
  setNotificationForm: PropTypes.func.isRequired,
  notificationSaving: PropTypes.bool,
  handleNotificationSave: PropTypes.func.isRequired,
  notificationFeedback: PropTypes.shape({
    type: PropTypes.oneOf(['success', 'error']),
    message: PropTypes.string,
  }),
  dayOptions: PropTypes.arrayOf(PropTypes.number),
}
