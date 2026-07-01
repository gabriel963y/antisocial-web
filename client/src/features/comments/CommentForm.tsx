import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { commentService } from '../../lib/api/commentService.ts'
import { useAuth } from '../../hooks/useAuth.ts'
import { Button } from '../../components/ui/Button.tsx'

const commentSchema = z.object({
  content: z.string().min(1, 'el comentario es obligatorio'),
})

type CommentFormData = z.infer<typeof commentSchema>

interface CommentFormProps {
  postId: string
  onCommentCreated: () => void
}

export function CommentForm({ postId, onCommentCreated }: CommentFormProps) {
  const { user: currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  const onSubmit = async (data: CommentFormData) => {
    if (!currentUser) return
    setIsLoading(true)

    try {
      await commentService.create({
        content: data.content,
        user_nickName: currentUser.nickName,
        post_id: postId,
      })
      reset()
      toast.success('comentario agregado')
      onCommentCreated()
    } catch {
      toast.error('error al publicar comentario')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-[0.15em] text-lime-400/40">
          comentario
        </label>
        <textarea
          {...register('content')}
          rows={3}
          className="border border-lime-400/15 bg-lime-400/[0.02] px-3 py-2 text-sm text-lime-300 outline-none placeholder:text-lime-400/15 focus:border-lime-400/40 resize-none"
        />
        {errors.content && (
          <p className="flex items-center gap-1.5 text-xs text-rose-400/80">
            <span className="inline-block h-3 w-[1px] bg-rose-400/40" />
            {errors.content.message}
          </p>
        )}
      </div>

      <Button type="submit" isLoading={isLoading}>
        comentar
      </Button>
    </form>
  )
}
