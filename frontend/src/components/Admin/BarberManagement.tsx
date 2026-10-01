import { useState } from 'react'
import type { Barber } from '../../types'
import { createBarber, updateBarber, deleteBarber } from '../../services/api'
import styles from './Admin.module.css'

const MOCK: Barber[] = [
  { id: '1', name: 'Marcus Silva', specialty: 'Degradê & Fade', rating: 4.9, reviewCount: 128, available: true },
  { id: '2', name: 'Diego Costa', specialty: 'Barba & Navalha', rating: 4.8, reviewCount: 97, available: true },
  { id: '3', name: 'Rafael Bronx', specialty: 'Cortes Modernos', rating: 4.9, reviewCount: 105, available: true },
  { id: '4', name: 'Alex Mendes', specialty: 'Estilo Clássico', rating: 4.7, reviewCount: 84, available: true },
]

const empty = (): Omit<Barber, 'id'> => ({ name: '', specialty: '', rating: 5.0, reviewCount: 0, available: true })

export default function BarberManagement() {
  const [barbers, setBarbers] = useState<Barber[]>(MOCK)
  const [editing, setEditing] = useState<Barber | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<Barber, 'id'>>(empty())
  const [loading, setLoading] = useState(false)

  const startEdit = (b: Barber) => { setEditing(b); setForm({ name: b.name, specialty: b.specialty, rating: b.rating, reviewCount: b.reviewCount, available: b.available }); setCreating(false) }
  const startCreate = () => { setCreating(true); setEditing(null); setForm(empty()) }
  const cancel = () => { setEditing(null); setCreating(false) }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (creating) {
        const res = await createBarber(form)
        setBarbers((prev) => [...prev, res.data])
      } else if (editing) {
        const res = await updateBarber(editing.id, form)
        setBarbers((prev) => prev.map((b) => (b.id === editing.id ? res.data : b)))
      }
      cancel()
    } catch {
      if (creating) {
        setBarbers((prev) => [...prev, { ...form, id: String(Date.now()) }])
        cancel()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este barbeiro?')) return
    try { await deleteBarber(id) } catch { /* optimistic */ }
    setBarbers((prev) => prev.filter((b) => b.id !== id))
  }

  const toggleAvailability = async (b: Barber) => {
    const updated = { ...b, available: !b.available }
    try {
      await updateBarber(b.id, { available: updated.available })
    } catch { /* optimistic */ }
    setBarbers((prev) => prev.map((x) => (x.id === b.id ? updated : x)))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className={styles.btnPrimary} onClick={startCreate}>+ Novo Barbeiro</button>
      </div>

      {(creating || editing) && (
        <div className={styles.formCard}>
          <h3 className={styles.formCardTitle}>{creating ? 'Novo Barbeiro' : 'Editar Barbeiro'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Nome</label>
              <input className={styles.fieldInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={80} />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Especialidade</label>
              <input className={styles.fieldInput} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} maxLength={80} />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Avaliação (0–5)</label>
              <input className={styles.fieldInput} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Disponível</label>
              <select className={styles.fieldInput} value={form.available ? 'true' : 'false'} onChange={(e) => setForm({ ...form, available: e.target.value === 'true' })}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className={styles.btnSecondary} onClick={cancel} disabled={loading}>Cancelar</button>
            <button className={styles.btnPrimary} onClick={handleSave} disabled={loading}>{loading ? '...' : 'Salvar'}</button>
          </div>
        </div>
      )}

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Barbeiro</th>
                <th className={styles.th}>Especialidade</th>
                <th className={styles.th}>Avaliação</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {barbers.map((b) => (
                <tr key={b.id} className={styles.tr}>
                  <td className={styles.td}><strong>{b.name}</strong></td>
                  <td className={styles.td} style={{ color: 'var(--color-text-muted)' }}>{b.specialty}</td>
                  <td className={styles.td} style={{ color: '#ffd700' }}>★ {b.rating} ({b.reviewCount})</td>
                  <td className={styles.td}>
                    <button
                      className={`${styles.badge} ${b.available ? styles['badge-confirmed'] : styles['badge-cancelled']}`}
                      onClick={() => toggleAvailability(b)}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      {b.available ? 'Disponível' : 'Indisponível'}
                    </button>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => startEdit(b)}>✏️ Editar</button>
                      <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => handleDelete(b.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
