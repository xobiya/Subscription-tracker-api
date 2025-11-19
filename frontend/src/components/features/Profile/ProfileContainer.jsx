import React, { useContext, useState, useEffect } from 'react'
import ProfileView from './ProfileView'
import { AuthContext } from '../../../contexts/AuthContext'
import notificationService from '../../../services/notificationService'

const DEFAULT_NOTIFICATION_FORM = {
  enabled: true,
  channels: ['email'],
  daysBefore: [7, 5, 2, 1],
  smsNumber: '',
  pushEndpoint: '',
}

const DAY_OPTIONS = [1, 2, 3, 5, 7, 14]

export default function ProfileContainer({ initialTab = 'profile' }) {
  const { user, token, save } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
    avatar: '',
  })
  const [notificationForm, setNotificationForm] = useState(DEFAULT_NOTIFICATION_FORM)
  const [notificationSaving, setNotificationSaving] = useState(false)
  const [notificationFeedback, setNotificationFeedback] = useState(null)

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

  useEffect(() => {
    if (!user || !token) return

    let cancelled = false
    const loadPreferences = async () => {
      try {
        const prefs = await notificationService.getPreferences({
          userId: user._id || user.id,
          token,
        })
        if (!cancelled) {
          setNotificationForm(prefs)
          setNotificationFeedback(null)
          save({ ...user, notificationPreferences: prefs }, token)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load notification preferences', err)
      }
    }

    loadPreferences()
    return () => {
      cancelled = true
    }
  }, [user, token, save])

  const handleSave = async () => {
    // Placeholder: integrate with an API service to persist profile changes.
    // Keep the UI behavior: close edit mode after save.
    try {
      // Example: await userService.updateProfile(form, token)
      // For now, just log and close the editor.
  // Placeholder save - currently not wired to backend; close editor after handling
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

  const handleNotificationSave = async () => {
    if (!user || !token) return
    try {
      setNotificationSaving(true)
      const payload = {
        enabled: notificationForm.enabled,
        channels: notificationForm.channels,
        daysBefore: notificationForm.daysBefore,
        smsNumber: notificationForm.smsNumber,
        pushEndpoint: notificationForm.pushEndpoint,
      }
      const saved = await notificationService.updatePreferences({
        userId: user._id || user.id,
        token,
        payload,
      })
      setNotificationFeedback({ type: 'success', message: 'Preferences saved.' })
      setNotificationForm(saved)
      save({ ...user, notificationPreferences: saved }, token)
    } catch (err) {
      const message = err?.message || 'Failed to save preferences'
      setNotificationFeedback({ type: 'error', message })
    } finally {
      setNotificationSaving(false)
    }
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
      notificationForm={notificationForm}
      setNotificationForm={setNotificationForm}
      notificationSaving={notificationSaving}
      handleNotificationSave={handleNotificationSave}
      notificationFeedback={notificationFeedback}
      dayOptions={DAY_OPTIONS}
    />
  )
}
