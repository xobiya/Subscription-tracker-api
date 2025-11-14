import React, { useContext, useState, useEffect } from 'react'
import ProfileView from './ProfileView'
import { AuthContext } from '../../../contexts/AuthContext'

export default function ProfileContainer() {
  const { user, token } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    avatar: '',
  })

  useEffect(() => {
    // initialize form from user when available
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      phone: user?.phone || '',
      avatar: user?.avatar || '',
    })
  }, [user])

  const handleSave = async () => {
    // Placeholder: integrate with an API service to persist profile changes.
    // Keep the UI behavior: close edit mode after save.
    try {
      // Example: await userService.updateProfile(form, token)
      // For now, just log and close the editor.
      // eslint-disable-next-line no-console
      console.log('Saving profile (not wired):', form)
      setIsEditing(false)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save profile', err)
    }
  }

  const handleCancel = () => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      phone: user?.phone || '',
      avatar: user?.avatar || '',
    })
    setIsEditing(false)
  }

  return (
    <ProfileView
      user={user}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      form={form}
      setForm={setForm}
      handleSave={handleSave}
      handleCancel={handleCancel}
    />
  )
}
