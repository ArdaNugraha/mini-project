/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import useFormAction from '@/hooks/useFormAction'
import { formJobSchema } from '@/types/form-schema'
import {
  Drawer,
  DrawerTitle,
  DrawerContent,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRef, useState } from 'react'
import { z } from 'zod'
import { defaultValueJob } from '@/constants'
import { ValueJobType } from '@/types/common'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

type AdminDashboardFormJobProps = {
  open: ValueJobType
  onOpen: () => void
  onFinish: () => void
  values?: z.infer<typeof formJobSchema> | any
}

export default function AdminDashboardFormJob({
  open,
  values,
  onOpen,
  onFinish,
}: AdminDashboardFormJobProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { form } = useFormAction({
    schema: formJobSchema,
    defaultValues: defaultValueJob,
    values,
  })

  const onSubmitClick = () => {
    formRef.current?.requestSubmit()
  }

  const onSubmit = async (values: z.infer<typeof formJobSchema>) => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/jobs${open?.type === 'edit' ? `/${open?.data.id}` : ''}`,
        {
          method: open?.type === 'create' ? 'POST' : 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        },
      )

      if (response.ok) {
        toast.success(`${open?.type} successful`)
        onFinish()
        handleClose()
      }
    } catch (error) {
      console.log('error => ', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpen()
    form.reset()
  }

  return (
    <Drawer open={!!open.type} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle className="text-center">Jobs</DrawerTitle>
        <div className="max-h-[90vh] overflow-y-auto container p-4 w-full max-w-sm mx-auto">
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="title ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="description ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="min_salary_offered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Salary Offered</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="min_salary_offered ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_salary_offered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Salary Offered</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="max_salary_offered ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_open"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open Job</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <div className="flex gap-2 justify-end p-4 container w-full max-w-sm mx-auto">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => onSubmitClick()}
              disabled={loading}
            >
              {loading && <Loader2Icon className="animate-spin" />}
              {loading ? 'Loading' : 'Submit'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
