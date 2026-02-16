import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, Department, Activity, Recommendation, Notification, QuestionCompetence } from '../types'
import {
  users as mockUsers,
  departments as mockDepartments,
  activities as mockActivities,
  recommendations as mockRecommendations,
  notifications as mockNotifications,
  questionCompetences as mockQuestions,
} from '../data/mock-data'

interface DataContextType {
  users: User[]
  departments: Department[]
  activities: Activity[]
  recommendations: Recommendation[]
  notifications: Notification[]
  questionCompetences: QuestionCompetence[]
  addUser: (user: User) => void
  updateUser: (user: User) => void
  deleteUser: (id: string) => void
  addDepartment: (dept: Department) => void
  updateDepartment: (dept: Department) => void
  deleteDepartment: (id: string) => void
  addActivity: (activity: Activity) => void
  updateActivity: (activity: Activity) => void
  updateRecommendation: (rec: Recommendation) => void
  markNotificationRead: (id: string) => void
  getUnreadCount: (userId: string) => number
  getUserNotifications: (userId: string) => Notification[]
  getActivityRecommendations: (activityId: string) => Recommendation[]
  getDepartmentName: (id: string) => string
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [questionCompetences] = useState<QuestionCompetence[]>(mockQuestions)

  const addUser = useCallback((user: User) => setUsers(prev => [...prev, user]), [])
  const updateUser = useCallback((user: User) => setUsers(prev => prev.map(u => u.id === user.id ? user : u)), [])
  const deleteUser = useCallback((id: string) => setUsers(prev => prev.filter(u => u.id !== id)), [])

  const addDepartment = useCallback((dept: Department) => setDepartments(prev => [...prev, dept]), [])
  const updateDepartment = useCallback((dept: Department) => setDepartments(prev => prev.map(d => d.id === dept.id ? dept : d)), [])
  const deleteDepartment = useCallback((id: string) => setDepartments(prev => prev.filter(d => d.id !== id)), [])

  const addActivity = useCallback((activity: Activity) => setActivities(prev => [...prev, activity]), [])
  const updateActivity = useCallback((activity: Activity) => setActivities(prev => prev.map(a => a.id === activity.id ? activity : a)), [])

  const updateRecommendation = useCallback((rec: Recommendation) => setRecommendations(prev => prev.map(r => r.id === rec.id ? rec : r)), [])

  const markNotificationRead = useCallback((id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), [])

  const getUnreadCount = useCallback((userId: string) =>
    notifications.filter(n => n.user_id === userId && !n.read).length, [notifications])

  const getUserNotifications = useCallback((userId: string) =>
    notifications.filter(n => n.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [notifications])

  const getActivityRecommendations = useCallback((activityId: string) =>
    recommendations.filter(r => r.activity_id === activityId).sort((a, b) => b.global_score - a.global_score), [recommendations])

  const getDepartmentName = useCallback((id: string) =>
    departments.find(d => d.id === id)?.name ?? 'N/A', [departments])

  return (
    <DataContext.Provider value={{
      users, departments, activities, recommendations, notifications, questionCompetences,
      addUser, updateUser, deleteUser,
      addDepartment, updateDepartment, deleteDepartment,
      addActivity, updateActivity,
      updateRecommendation,
      markNotificationRead, getUnreadCount, getUserNotifications,
      getActivityRecommendations, getDepartmentName,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within a DataProvider')
  return context
}
