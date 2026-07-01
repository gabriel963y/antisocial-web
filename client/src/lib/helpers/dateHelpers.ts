export const formatDate = (rawDate?: string) => {
    if (!rawDate) return ''

    const date = new Date(rawDate)

    if (Number.isNaN(date.getTime())) {
        return rawDate
    }

    return new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).format(date)
}