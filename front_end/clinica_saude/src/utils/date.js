// Utilitário central para interpretar as datas do projeto.
// O db.json mistura formatos (dd-mm-yyyy, dd/mm/yyyy e yyyy-mm-dd),
// então normalizamos tudo para um objeto Date antes de comparar/ordenar.

export const parseFlexibleDate = (value) => {
    if (!value) return null

    // yyyy-mm-dd (formato nativo do <input type="date">)
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        const [year, month, day] = value.split('-').map(Number)
        return new Date(year, month - 1, day)
    }

    // dd-mm-yyyy ou dd/mm/yyyy
    const match = value.match(/^(\d{2})[/-](\d{2})[/-](\d{4})/)
    if (match) {
        const [, day, month, year] = match
        return new Date(Number(year), Number(month) - 1, Number(day))
    }

    const fallback = new Date(value)
    return isNaN(fallback.getTime()) ? null : fallback
}

// Combina data + hora (string "HH:mm") em um único Date para ordenação precisa
export const parseDateTime = (date, time) => {
    const base = parseFlexibleDate(date)
    if (!base) return null
    if (time && /^\d{2}:\d{2}/.test(time)) {
        const [h, m] = time.split(':').map(Number)
        base.setHours(h, m, 0, 0)
    }
    return base
}

// Quantos dias faltam para a data (negativo = já venceu)
export const daysUntil = (value) => {
    const date = parseFlexibleDate(value)
    if (!date) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    return Math.round((date - today) / (1000 * 60 * 60 * 24))
}

export const formatDateBR = (value) => {
    const date = parseFlexibleDate(value)
    if (!date) return '-'
    return date.toLocaleDateString('pt-BR')
}
