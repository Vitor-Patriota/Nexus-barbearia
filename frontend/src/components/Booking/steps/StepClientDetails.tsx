import { useState } from 'react'
import { useBooking } from '../../../contexts/BookingContext'
import styles from './Steps.module.css'

export default function StepClientDetails() {
  const { formData, setClientDetails, nextStep, prevStep } = useBooking()

  const [name, setName] = useState(formData.clientName)
  const [phone, setPhone] = useState(formData.clientPhone)
  const [email, setEmail] = useState(formData.clientEmail)

  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 10)
      return digits.replace(/(\d{2})(\d{4})(\d*)/, '($1) $2-$3')
    return digits.replace(/(\d{2})(\d{5})(\d*)/, '($1) $2-$3')
  }

  const isValid = name.trim().length >= 3 && phone.replace(/\D/g, '').length >= 10

  const handleNext = () => {
    setClientDetails(name.trim(), phone, email.trim())
    nextStep()
  }

  return (
    <div>
      <h3 className={styles.stepTitle}>Seus Dados</h3>
      <p className={styles.stepSubtitle}>Precisamos de algumas informações para confirmar seu agendamento</p>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="bk-name">Nome Completo *</label>
          <input
            id="bk-name"
            className={styles.input}
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            autoComplete="name"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="bk-phone">Telefone / WhatsApp *</label>
          <input
            id="bk-phone"
            className={styles.input}
            type="tel"
            placeholder="(11) 94700-1947"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            autoComplete="tel"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="bk-email">E-mail (opcional)</label>
          <input
            id="bk-email"
            className={styles.input}
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
            autoComplete="email"
          />
        </div>
      </div>

      <div className={styles.btnRow}>
        <button className={styles.btnBack} onClick={prevStep}>Voltar</button>
        <button className={styles.btnNext} onClick={handleNext} disabled={!isValid}>
          Próximo
        </button>
      </div>
    </div>
  )
}
