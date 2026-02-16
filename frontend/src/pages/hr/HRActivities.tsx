import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import StatusBadge from '../../components/shared/StatusBadge'
import DataTable from '../../components/shared/DataTable'
import { Plus, Search, Eye, Sparkles } from 'lucide-react'
import type { Activity } from '../../types'

export default function HRActivities() {
  const { activities } = useData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = activities.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const columns = [
    { key: 'title', header: 'Titre', render: (a: Activity) => (
      <div className="flex flex-col">
        <span className="font-medium text-card-foreground">{a.title}</span>
        <span className="text-xs text-muted-foreground line-clamp-1">{a.description}</span>
      </div>
    )},
    { key: 'type', header: 'Type', render: (a: Activity) => <StatusBadge status={a.type} /> },
    { key: 'seats', header: 'Places', render: (a: Activity) => <span className="font-medium">{a.seats}</span> },
    { key: 'date', header: 'Date', render: (a: Activity) => <span className="text-sm">{new Date(a.date).toLocaleDateString('fr-FR')}</span> },
    { key: 'priority', header: 'Priorite', render: (a: Activity) => <StatusBadge status={a.priority} /> },
    { key: 'status', header: 'Statut', render: (a: Activity) => <StatusBadge status={a.status} /> },
    { key: 'actions', header: 'Actions', render: (a: Activity) => (
      <div className="flex items-center gap-1">
        <Link to={`/hr/recommendations/${a.id}`} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-accent">
          <Sparkles className="h-3.5 w-3.5" /> AI Reco
        </Link>
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Activites</h1>
          <p className="text-sm text-muted-foreground">{activities.length} activites au total</p>
        </div>
        <Link to="/hr/create-activity" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Creer
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">Tous statuts</option>
          <option value="draft">Brouillon</option>
          <option value="open">Ouvert</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Termine</option>
        </select>
      </div>

      <DataTable columns={columns} data={filtered} emptyMessage="Aucune activite trouvee" />
    </div>
  )
}
