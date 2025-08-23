import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, ZodTypeAny } from 'zod'
import { useEffect } from 'react'

export default function useFormAction<T extends ZodTypeAny>(params: {
  schema: T
  values?: z.infer<T>
  defaultValues: z.infer<T>
}) {
  const { schema, values, defaultValues } = params

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useEffect(() => {
    if (values) {
      form.reset(values)
    }
  }, [values, form])

  return { form }
}
