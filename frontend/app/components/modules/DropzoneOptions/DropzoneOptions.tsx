import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import styles from './DropzoneOptions.module.scss'
import { WarningDiv } from '@/elements/WarningDiv/WarningDiv'

type Props = {
  images: string[]
  onPhotoDrop: (arg: string) => void
  maxSize: number
  acceptedFileFormat: string
  instruction?: string
}

export const DropzoneOptions = ({
  images,
  onPhotoDrop,
  maxSize,
  acceptedFileFormat,
  instruction
}: Props) => {
  const [photos, setPhotos] = useState<any[]>([])
  const [errorMsg, setErrorMsg] = useState<string>('')
  const parsedFileFormat = acceptedFileFormat.split(/[\/,]+/).filter((v, i) => {
    return i % 2 !== 0
  })

  const ERROR_FILE_SIZE = `Please upload another image lower than ${
    maxSize / 1000
  }kB`
  const ERROR_FILE_FORMAT = `Please upload ${parsedFileFormat.toString()} file only`

  const onDrop = useCallback((uploadedPhoto) => {
    // Setup file reader
    const reader = new FileReader()
    try {
      reader.readAsDataURL(uploadedPhoto[0])
      if (uploadedPhoto[0].size < maxSize) {
        setErrorMsg('')
        reader.onload = (event) => {
          const imgString = event.target?.result
          if (typeof imgString === 'string') {
            onPhotoDrop(imgString)
            setPhotos(
              uploadedPhoto.map((photo: any) =>
                Object.assign(photo, {
                  preview: URL.createObjectURL(photo)
                })
              )
            )
          }
        }
      } else {
        throw new Error(ERROR_FILE_SIZE)
      }
    } catch (e) {
      if ((e as Error).message === ERROR_FILE_SIZE) {
        setErrorMsg(ERROR_FILE_SIZE)
      } else {
        setErrorMsg(ERROR_FILE_FORMAT)
      }
      setPhotos([])
    }
  }, [])

  const onChoose = useCallback(async (src: string) => {
    const option = await (await fetch(src)).blob()
    const reader = new FileReader()
    reader.readAsDataURL(option)
    setErrorMsg('')
    reader.onload = (e) => {
      if (option.size < maxSize && typeof e.target?.result === 'string') {
        onPhotoDrop(e.target?.result)
        setPhotos([
          {
            preview: URL.createObjectURL(option),
            name: 'sample.jpg'
          }
        ])
      }
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFileFormat,
    onDrop,
    multiple: false
  })

  const preview = photos[0] && (
    <Image
      src={photos[0].preview}
      layout="fill"
      objectFit="contain"
      key={photos[0].name}
    />
  )

  // Revoke data URIs
  useEffect(() => {
    photos.forEach((photo: any) => URL.revokeObjectURL(photo.preview))
  }, [photos])

  return (
    <div className={styles.dropzoneOptions}>
      <WarningDiv message={errorMsg} className={styles.warningWrapper} />
      <div className={styles.previewNOptions}>
        <div {...getRootProps()} className={styles.dropzoneContainer}>
          <input {...getInputProps()} />
          {photos.length === 0 ? (
            <aside className={styles.instruction}>
              <p><strong>{instruction || 'Drag and drop your image here, or click to select image'}</strong></p>
            </aside>
          ) : (
            <aside className={styles.imagePreview}>{preview}</aside>
          )}
        </div>
        <div className={styles.imageOptions}>
          {images.map((imageName: string, i: number) => (
            <div className={styles.items} key={i}>
              <Image
                onClick={(e: MouseEvent<HTMLImageElement>) => {
                  const img = e.target as HTMLImageElement
                  onChoose(img.src)
                }}
                src={imageName}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
