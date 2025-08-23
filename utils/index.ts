import { NextResponse } from 'next/server'

export function indonesiaRupiah(value: number, withRupiah: boolean): string {
  const formatted = Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)

  if (!withRupiah) return formatted.replace('Rp', '')
  return formatted
}

export function formatRangeRupiah(min: number, max: number): string {
  return `${indonesiaRupiah(min, false)} - ${indonesiaRupiah(max, false)} IDR`
}

export function jsonResponse<T>({
  data,
  status = 200,
}: {
  data: T
  status?: number
}): NextResponse {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse({
  message = 'Something went wrong',
  status = 500,
  errors,
}: {
  message?: string
  status?: number
  errors?: unknown
}): NextResponse {
  return NextResponse.json({ success: false, message, errors }, { status })
}
