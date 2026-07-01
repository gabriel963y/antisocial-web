import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react'
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

    const [existingTags, setExistingTags] = useState<Tag[]>([])
    const [tagInput, setTagInput] = useState('')
    const [postTags, setPostTags] = useState<string[]>([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        loadTags()
    }, [])

    const loadTags = async () => {
        try {
            const tagsFromApi = await tagService.getTags()
            setExistingTags(tagsFromApi)
        } catch (error) {
            console.error('ERROR TAGS:', error)
            setError('No se pudieron cargar las etiquetas')
        }
    }

    const normalizeTagName = (tagName: string) => {
        return tagName.trim().toLowerCase()
    }

    const addTagToPost = () => {
        setError('')

        const normalizedTag = normalizeTagName(tagInput)

        if (!normalizedTag) {
            setError('Escribí una etiqueta')
            return
        }

        if (postTags.includes(normalizedTag)) {
            setTagInput('')
            return
        }

        setPostTags([...postTags, normalizedTag])
        setTagInput('')
    }

    const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            addTagToPost()
        }
    }

    const removeTagFromPost = (tagName: string) => {
        setPostTags(postTags.filter((tag) => tag !== tagName))
    }

    const getOrCreateTagId = async (tagName: string) => {
        const existingTag = existingTags.find(
            (tag) => normalizeTagName(getTagName(tag)) === tagName,
        )

        if (existingTag) {
            const existingTagId = getTagId(existingTag)

            if (existingTagId) {
                return existingTagId
            }
        }

        const createdTag = await tagService.createTag(tagName)
        const createdTagId = getTagId(createdTag)

        if (!createdTagId) {
            throw new Error(`No se pudo obtener el id de la etiqueta ${tagName}`)
        }

        return createdTagId
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

            for (const tagName of postTags) {
                const tagId = await getOrCreateTagId(tagName)
                await postService.addTag(postId, tagId)
            }

            toast.success('Publicación creada correctamente')

            window.dispatchEvent(new Event('post-created'))
            onClose()
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
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
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
                                        handleImageChange(
                                            index,
                                            event.target.value,
                                        )
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
                            Etiquetas
                        </p>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(event) =>
                                    setTagInput(event.target.value)
                                }
                                onKeyDown={handleTagKeyDown}
                                placeholder="Ej: humor"
                                className="w-full rounded-xl border border-lime-400/20 bg-black/40 px-3 py-2 text-sm text-lime-100 outline-none placeholder:text-lime-400/30 focus:border-lime-400/60"
                            />

                            <button
                                type="button"
                                onClick={addTagToPost}
                                disabled={!tagInput.trim()}
                                className="rounded-xl border border-lime-400/30 px-4 text-xs font-semibold text-lime-400/70 hover:bg-lime-400/10 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                agregar
                            </button>
                        </div>

                        {postTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {postTags.map((tagName) => (
                                    <button
                                        key={tagName}
                                        type="button"
                                        onClick={() =>
                                            removeTagFromPost(tagName)
                                        }
                                        className="rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs text-lime-300 hover:border-red-400/40 hover:text-red-300"
                                    >
                                        #{tagName} ×
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-xl border border-lime-400/20 px-3 py-2 text-xs font-semibold text-lime-400/50 hover:bg-lime-400/10 sm:px-4 sm:py-3 sm:text-sm"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading || !description.trim()}
                            className="w-full rounded-xl bg-lime-400 px-3 py-2 text-xs font-semibold text-black disabled:cursor-not-allowed sm:px-4 sm:py-3 sm:text-sm"
                        >
                            {loading ? 'Publicando...' : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}