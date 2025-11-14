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
}) {
  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ]

  const notificationSettings = [
    { id: 'email', label: 'Email notifications', description: 'Receive updates via email', enabled: true },
    { id: 'push', label: 'Push notifications', description: 'Receive browser notifications', enabled: true },
    { id: 'renewal', label: 'Renewal reminders', description: 'Get notified before subscriptions renew', enabled: true },
    { id: 'price', label: 'Price changes', description: 'Alert when subscription prices change', enabled: false },
  ]

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
                <Card className="p-6 border-0 shadow-lg">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                    <p className="text-gray-600">Choose how you want to be notified</p>
                  </div>

                  <div className="space-y-4">
                    {notificationSettings.map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="font-medium text-gray-900">{setting.label}</h3>
                          <p className="text-sm text-gray-500">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
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
}
