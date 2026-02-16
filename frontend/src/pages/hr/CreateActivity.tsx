import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import type { Activity, ActivityType, PriorityContext, RequiredSkill, CompetenceType, SkillLevel } from '../../types'

export default function CreateActivity() {
  const { addActivity, users } = useData()
  const { user } = useAuth()
  const navigate = useNavigate()

  const managers = users.filter(u => u.role === 'MANAGER')

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'training' as ActivityType,
    seats: 5,
    date: '',
    duration: '',
    location: '',
    priority: 'consolidate_medium' as PriorityContext,
    assigned_manager: '',
  })

  const [skills, setSkills] = useState<RequiredSkill[]>([
    { skill_name: '', type: 'know_how', desired_level: 'medium', weight: 0.5 }
  ])

  const addSkill = () => setSkills([...skills, { skill_name: '', type: 'know_how', desired_level: 'medium', weight: 0.3 }])
  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i))
  const updateSkill = (i: number, updates: Partial<RequiredSkill>) => setSkills(skills.map((s, idx) => idx === i ? { ...s, ...updates } : s))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const activity: Activity = {
      ...form,
      id: String(Date.now()),
      required_skills: skills.filter(s => s.skill_name),
      status: 'draft',
      created_by: user?.id ?? '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    addActivity(activity)
    navigate('/hr/activities')
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Creer une activite</h1>
          <p className="text-sm text-muted-foreground">Definir une nouvelle activite et ses competences requises</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* General info */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">Informations generales</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-medium text-card-foreground">Titre</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Ex: Formation React Advanced" />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-medium text-card-foreground">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Decrivez l'activite en detail..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ActivityType })}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="training">Formation</option>
                <option value="certification">Certification</option>
                <option value="project">Projet</option>
                <option value="mission">Mission</option>
                <option value="audit">Audit</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">Nombre de places</label>
              <input type="number" min={1} value={form.seats} onChange={(e) => setForm({ ...form, seats: +e.target.value })}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">Duree</label>
              <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Ex: 3 jours"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">Lieu</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex: Siege Tunis"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">Priorite</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as PriorityContext })}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="develop_low">Developper (bas niveau)</option>
                <option value="consolidate_medium">Consolider (niveau moyen)</option>
                <option value="exploit_expert">Exploiter (expert)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">Manager responsable</label>
              <select value={form.assigned_manager} onChange={(e) => setForm({ ...form, assigned_manager: e.target.value })}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">-- Selectionner --</option>
                {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Required skills */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-card-foreground">Competences requises</h3>
            <button type="button" onClick={addSkill} className="flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-80">
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {skills.map((skill, i) => (
              <div key={i} className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-background p-3">
                <div className="flex flex-1 min-w-[150px] flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Competence</label>
                  <input value={skill.skill_name} onChange={(e) => updateSkill(i, { skill_name: e.target.value })} placeholder="Nom de la competence"
                    className="h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Type</label>
                  <select value={skill.type} onChange={(e) => updateSkill(i, { type: e.target.value as CompetenceType })}
                    className="h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="knowledge">Savoir</option>
                    <option value="know_how">Savoir-faire</option>
                    <option value="soft_skills">Savoir-etre</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Niveau</label>
                  <select value={skill.desired_level} onChange={(e) => updateSkill(i, { desired_level: e.target.value as SkillLevel })}
                    className="h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="low">Bas</option>
                    <option value="medium">Moyen</option>
                    <option value="high">Eleve</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="flex w-20 flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Poids</label>
                  <input type="number" step={0.1} min={0} max={1} value={skill.weight} onChange={(e) => updateSkill(i, { weight: +e.target.value })}
                    className="h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                {skills.length > 1 && (
                  <button type="button" onClick={() => removeSkill(i)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-card-foreground hover:bg-accent">Annuler</button>
          <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">Creer l'activite</button>
        </div>
      </form>
    </div>
  )
}
