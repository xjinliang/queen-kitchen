import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  onUpload: (url: string) => void
  currentUrl?: string | null
  folder?: 'dishes' | 'cooked'
}

export default function ImageUploader({ onUpload, currentUrl, folder = 'dishes' }: Props) {
  const { user } = useAuth()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [error, setError] = useState('')

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('图片不能超过 5MB')
      return
    }

    setError('')
    setUploading(true)

    try {
      const ext = file.name.split('.').pop()
      const path = `${folder}/${user!.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('dish-images')
        .upload(path, file)

      if (uploadError) {
        setError(uploadError.message || '上传失败')
        setUploading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('dish-images')
        .getPublicUrl(path)

      const publicUrl = urlData.publicUrl
      setPreview(publicUrl)
      onUpload(publicUrl)
    } catch (e: any) {
      setError(e?.message || '上传失败，请重试')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {preview ? (
        <div className="relative rounded-xl overflow-hidden bg-gray-100">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => { setPreview(null); onUpload('') }}
            className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-400 transition-colors bg-gray-50"
        >
          {uploading ? (
            <span className="w-6 h-6 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
          ) : (
            <>
              <Upload size={28} />
              <span className="text-sm">点击上传图片</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
