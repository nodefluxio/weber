import { MouseEvent, useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import styles from "./DropzoneOptions.module.scss"

type Props = {
  images: string[],
  onPhotoDrop: Function,
  // onPhotoSrc: Function
}

export const DropzoneOptions = ({ images, onPhotoDrop }: Props) => {

  const [photos, setPhotos] = useState<any[]>([])
  const MAX_IMAGE_SIZE = 800000 // 800kB

  const onDrop = useCallback(uploadedPhoto => {
    // Setup file reader
    const reader = new FileReader()
    reader.readAsDataURL(uploadedPhoto[0])
    console.log(uploadedPhoto[0])
    reader.onload = (event) => {
      // Max accepted image file = 800kB
      if (uploadedPhoto[0].size < MAX_IMAGE_SIZE) {
        onPhotoDrop(event.target?.result)

        // Set Photo for Preview at Dropzone
        setPhotos(uploadedPhoto.map((photo: any) =>
          Object.assign(photo, {
            preview: URL.createObjectURL(photo)
          })
        ))
      }
    }
  }, [])

  const onChoose = useCallback(async (src: string) => {
    const option = await (await fetch(src)).blob()
    const reader = new FileReader()
    reader.readAsDataURL(option)
    reader.onload = (e) => {
      if (option.size < MAX_IMAGE_SIZE) {
        onPhotoDrop(e.target?.result)
        setPhotos([{
          preview: URL.createObjectURL(option),
          name: "sample.jpg"
        }])
      }
    }
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    accept: "image/jpeg",
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
    <div className={styles.doubleColumn}>
      <div {...getRootProps()} className={styles.dropzoneContainer}>
        <input {...getInputProps()} />
        {
          photos.length === 0 ?
            <aside className={styles.instruction}>
              <p>Drag and drop your image here, or click to select image</p>
            </aside>
            :
            <aside className={styles.imagePreview}>
              {preview}
            </aside>
        }
      </div>
      <div className={styles.imageOptions}>
        {
          images.map((imageName: string, i: number) => (
            <div className={styles.items} key={i}>
              <Image
                onClick={(e: MouseEvent<HTMLImageElement>)=> { 
                  const img = e.target as HTMLImageElement;
                  onChoose(img.src) 
                }}
                src={imageName}
                layout="fill"
                objectFit="cover" />
            </div>
          ))
        }
      </div>
    </div>
  )
}