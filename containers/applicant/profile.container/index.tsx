'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { button, input, label, textarea } from '@/components/ui' // sesuaikan import shadcn ui components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    socials: '',
    min_salary_expectation: '',
    max_salary_expectation: '',
    summary: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch current user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/applicant/profile') // buat endpoint GET profile (optional)
        if (!res.ok) throw new Error('Failed to fetch profile')
        const data = await res.json()

        setForm({
          full_name: data.full_name ?? '',
          phone: data.phone ?? '',
          email: data.email ?? '',
          password: '',
          socials: JSON.stringify(data.socials || {}),
          min_salary_expectation: data.min_salary_expectation?.toString() ?? '',
          max_salary_expectation: data.max_salary_expectation?.toString() ?? '',
          summary: data.summary ?? '',
        })
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('Failed to load profile data.')
      }
    }
    fetchProfile()
  }, [])

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...form,
        min_salary_expectation: Number(form.min_salary_expectation),
        max_salary_expectation: Number(form.max_salary_expectation),
        socials: JSON.parse(form.socials),
        password: form.password || undefined,
      }

      const res = await fetch('/applicant/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to update profile')

      router.refresh()
      alert('Profile updated!')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl mx-auto p-4">
      <div>
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          value={form.full_name}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={onChange}
          required
          maxLength={13}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
        />
      </div>

      <div>
        <Label htmlFor="socials">Socials</Label>
        <Textarea
          id="socials"
          name="socials"
          value={form.socials}
          onChange={onChange}
        />
      </div>

      <div>
        <Label htmlFor="min_salary_expectation">Min Salary Expectation</Label>
        <Input
          id="min_salary_expectation"
          name="min_salary_expectation"
          type="number"
          value={form.min_salary_expectation}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="max_salary_expectation">Max Salary Expectation</Label>
        <Input
          id="max_salary_expectation"
          name="max_salary_expectation"
          type="number"
          value={form.max_salary_expectation}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          value={form.summary}
          onChange={onChange}
          required
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  )
}
