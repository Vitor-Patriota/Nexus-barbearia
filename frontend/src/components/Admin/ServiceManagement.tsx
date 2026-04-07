import { useState } from 'react'
import type { Service } from '../../types'
import {
  createService,
  updateService,
  deleteService,
} from '../../services/api'
import styles from './Admin.module.css'

const MOCK: Service[] = [
  { id: '1', name: 'Corte Clássico', description: 'Lavagem e finalização inclusos', price: 45, duration: 45 },
  { id: '2', name: 'Corte + Barba', description: 'Combo completo', price: 75, duration: 75 },
  { id: '3', name: 'Barba Completa', description: 'Navalha quente + modelagem', price: 40, duration: 40 },
  { id: '4', name: 'Degradê Premium', description: 'Alta precisão + contorno', price: 55, duration: 50 },
  { id: '5', name: 'Design Sobrancelha', description: 'Modelagem profissional', price: 20, duration: 20 },
  { id: '6', name: 'Pacote VIP', description: 'Experiência completa', price: 120, duration: 120 },
]

const empty = (): Omit<Service, 'id'> => ({ name: '', description: '', price: 0, duration: 30 })

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>(MOCK)
  const [editing, setEditing] = useState<Service | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<Service, 'id'>>(empty())
  const [loading, setLoading] = useState(false)

  const startEdit = (s: Service) => { setEditing(s); setForm({ name: s.name, description: s.description, price: s.price, duration: s.duration }); setCreating(false) }
  const startCreate = () => { setCreating(true); setEditing(null); setForm(empty()) }
  const cancel = () => { setEditing(null); setCreating(false) }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (creating) {
        const res = await createService(form)
        setServices((prev) => [...prev, res.data])
      } else if (editing) {
        const res = await updateService(editing.id, form)
        setServices((prev) => prev.map((s) => (s.id === editing.id ? res.data : s)))
      }
      cancel()
    } catch {
      if (creating) {
        const newS: Service = { ...form, id: String(Date.now()) }
        setServices((prev) => [...prev, newS])
        cancel()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este serviço?')) return
    try {
      await deleteService(id)
    } catch { /* optimistic */ }
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className={styles.btnPrimary} onClick={startCreate}>+ Novo Serviço</button>
      </div>

      {(creating || editing) && (
        <div className={styles.formCard}>
          <h3 className={styles.formCardTitle}>{creating ? 'Novo Serviço' : 'Editar Serviço'}</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Nome</label>
              <input className={styles.fieldInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={80} />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Preço (R$)</label>
              <input className={styles.fieldInput} type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Duração (min)</label>
              <input className={styles.fieldInput} type="number" min="5" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
            </div>
            <div className={`${styles.field} ${styles.colSpan2}`}>
              <label className={styles.fieldLabel}>Descrição</label>
              <input className={styles.fieldInput} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={200} />
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
                <th className={styles.th}>Serviço</th>
                <th className={styles.th}>Descrição</th>
                <th className={styles.th}>Preço</th>
                <th className={styles.th}>Duração</th>
                <th className={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className={styles.tr}>
                  <td className={styles.td}><strong>{s.name}</strong></td>
                  <td className={styles.td} style={{ color: 'var(--color-text-muted)' }}>{s.description}</td>
                  <td className={styles.td}><span className={styles.price}>R$ {s.price}</span></td>
                  <td className={styles.td}>{s.duration} min</td>
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn} onClick={() => startEdit(s)}>✏️ Editar</button>
                      <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => handleDelete(s.id)}>🗑️</button>
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
