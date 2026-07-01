import { useEffect, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { postService } from '../../lib/api/postService.ts'
import { tagService } from '../../lib/api/tagService.ts'
import { getTagId, getTagName } from '../../lib/helpers/postHelpers.ts'
import { useAuth } from '../../hooks/useAuth.ts'
import type { Tag } from '../../types/post.ts'

type CreatePostProps = {
    onClose: () => void
}

export function CreatePost({ onClose }: CreatePostProps) {
    const { user } = useAuth()

    const [description, setDescription] = useState('')
    const [imageUrls, setImageUrls] = useState<string[]>([''])

    const [tags, setTags] = useState<Tag[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [newTagName, setNewTagName] = useState('')

    const [loading, setLoading] = useState(false)
    const [creatingTag, setCreatingTag] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        loadTags()
    }, [])

    const loadTags = async () => {
        try {
            const tagsFromApi = await tagService.getTags()
            setTags(tagsFromApi)
        } catch (error) {
            console.error('ERROR TAGS:', error)
            setError('No se pudieron cargar las etiquetas')
        }
    }

    const toggleTag = (tagId: string) => {
        if (selectedTags.includes(tagId)) {
            setSelectedTags(selectedTags.filter((id) => id !== tagId))
        } else {
            setSelectedTags([...selectedTags, tagId])
        }
    }

    const handleCreateTag = async () => {
        setError('')

        if (!newTagName.trim()) {
            setError('Escribí el nombre de la etiqueta')
            return
        }

        try {
            setCreatingTag(true)

            const createdTag = await tagService.createTag(newTagName.trim())
            const createdTagId = getTagId(createdTag)

            await loadTags()

            if (createdTagId) {
                setSelectedTags((previousTags) => {
                    if (previousTags.includes(createdTagId)) {
                        return previousTags
                    }

                    return [...previousTags, createdTagId]
                })
            }

            setNewTagName('')
            toast.success('Etiqueta creada correctamente')
        } catch (error) {
            console.error('ERROR CREANDO TAG:', error)

            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('No se pudo crear la etiqueta')
            }
        } finally {
            setCreatingTag(false)
        }
    }

    const handleImageChange = (index: number, value: string) => {
        const newImageUrls = [...imageUrls]
        newImageUrls[index] = value
        setImageUrls(newImageUrls)
    }

    const addImageInput = () => {
        setImageUrls([...imageUrls, ''])
    }

    const removeImageInput = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index))
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setError('')

        if (!description.trim()) {
            setError('La descripción es obligatoria')
            return
        }

        if (!user) {
            setError('Tenés que iniciar sesión para publicar')
            return
        }

        const currentUser = user as {
            id?: string
            _id?: string
            nickName?: string
        }

        if (!currentUser.nickName) {
            setError('No se pudo obtener el usuario logueado')
            return
        }

        try {
            setLoading(true)

            const postId = await postService.createPost(
                description.trim(),
                currentUser.nickName,
            )

            const validImageUrls = imageUrls
                .map((url) => url.trim())
                .filter((url) => url !== '')

            for (const url of validImageUrls) {
                await postService.addImage(postId, url)
            }

            for (const tagId of selectedTags) {
                await postService.addTag(postId, tagId)
            }

            toast.success('Publicación creada correctamente')
            onClose()

            setTimeout(() => {
                window.location.reload()
            }, 500)
        } catch (error) {
            console.error('ERROR CREANDO POST:', error)

            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('No se pudo crear la publicación')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/35 px-4">
            <div className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-lime-400/30 bg-zinc-950 text-lime-100 shadow-2xl">
                <div className="flex items-center justify-between border-b border-lime-400/10 px-5 py-4">
                    <h2 className="text-lg font-semibold text-lime-300">
                        Crear publicación
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-3 py-1 text-xl text-lime-400/60 hover:bg-lime-400/10 hover:text-lime-300"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-5">
                    {error && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-xs text-lime-400/50">
                            Descripción
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="¿Qué estás pensando?"
                            className="min-h-32 w-full resize-none rounded-xl border border-lime-400/30 bg-black/40 p-4 text-sm text-lime-100 outline-none placeholder:text-lime-400/30 focus:border-lime-400/70"
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs text-lime-400/50">
                            Imágenes opcionales
                        </p>

                        {imageUrls.map((url, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(event) =>
                                        handleImageChange(index, event.target.value)
                                    }
                                    placeholder="URL de imagen"
                                    className="w-full rounded-xl border border-lime-400/20 bg-black/40 px-3 py-2 text-sm text-lime-100 outline-none placeholder:text-lime-400/30 focus:border-lime-400/60"
                                />

                                {imageUrls.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeImageInput(index)}
                                        className="rounded-xl border border-red-400/30 px-3 text-xs text-red-300 hover:bg-red-400/10"
                                    >
                                        quitar
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addImageInput}
                            className="text-xs text-lime-400/50 hover:text-lime-300"
                        >
                            + agregar otra imagen
                        </button>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs text-lime-400/50">
                            Crear nueva etiqueta
                        </p>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTagName}
                                onChange={(event) => setNewTagName(event.target.value)}
                                placeholder="Ej: humor"
                                className="w-full rounded-xl border border-lime-400/20 bg-black/40 px-3 py-2 text-sm text-lime-100 outline-none placeholder:text-lime-400/30 focus:border-lime-400/60"
                            />

                            <button
                                type="button"
                                onClick={handleCreateTag}
                                disabled={creatingTag || !newTagName.trim()}
                                className="rounded-xl border border-lime-400/30 px-4 text-xs font-semibold text-lime-400/70 hover:bg-lime-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                {creatingTag ? '...' : 'crear'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs text-lime-400/50">
                            Etiquetas
                        </p>

                        {tags.length === 0 ? (
                            <p className="text-xs text-lime-400/25">
                                No hay etiquetas disponibles
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => {
                                    const tagId = getTagId(tag)

                                    if (!tagId) return null

                                    return (
                                        <button
                                            key={tagId || index}
                                            type="button"
                                            onClick={() => toggleTag(tagId)}
                                            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                                                selectedTags.includes(tagId)
                                                    ? 'border-lime-400 bg-lime-400 text-black'
                                                    : 'border-lime-400/20 text-lime-400/50 hover:border-lime-400/60 hover:text-lime-300'
                                            }`}
                                        >
                                            {getTagName(tag)}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-xl border border-lime-400/20 px-4 py-3 text-sm font-semibold text-lime-400/50 hover:bg-lime-400/10"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !description.trim()}
                            className="w-full rounded-xl bg-lime-400 px-4 py-3 text-sm font-semibold text-black transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            {loading ? 'Publicando...' : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}