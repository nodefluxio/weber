import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import styles from "./DropzoneOptions.module.scss"

type Props = {
  onPhotoDrop: Function
}

export const DropzoneOptions = ({ onPhotoDrop }: Props) => {

  const [photos, setPhotos] = useState<any[]>([])

  const onDrop = useCallback(uploadedPhoto => {
    // Setup file reader
    const reader = new FileReader()
    reader.readAsDataURL(uploadedPhoto[0])
    reader.onload = (event) => {
      onPhotoDrop(event.target?.result)
    }
    // Set Photo for Preview at Dropdown
    setPhotos(uploadedPhoto.map((photo: any) =>
      Object.assign(photo, {
        preview: URL.createObjectURL(photo)
      })
    ))
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

  const preview = photos[0] ? (
    <Image
      src={photos[0].preview}
      layout="fill"
      objectFit="contain"
      key={photos[0].name}
    />
  ) : null

  const onChoose = useCallback(async (src: string) => {
    const option = await (await fetch(src)).blob()
    const reader = new FileReader()
    reader.readAsDataURL(option)
    reader.onload = (e) => {
      onPhotoDrop(e.target?.result)
    }
    setPhotos([{
      preview: URL.createObjectURL(option),
      name: "sample.jpg"
    }])
  }, [])

  // Revoke data URIs
  useEffect(() => {
    photos.forEach((photo: any) => URL.revokeObjectURL(photo.preview))
  }, [photos])

  return (
    <div className={styles["double-column"]}>
      <div {...getRootProps()} className={styles["dropzone-container"]}>
        <input {...getInputProps()} />
        {
          photos.length === 0 ?
            <aside className={styles.instruction}>
              <p>Drag and drop your image here, or click to select image</p>
            </aside>
            :
            <aside className={styles["image-preview"]}>
              {preview}
            </aside>
        }
      </div>
      <div className={styles["image-options"]}>
        {
          [...Array(4)].map((u: any, i: number) => (
            <div className={styles["image-option"]}>
              <Image
                onClick={(e: any) => { onChoose(e.target.src) }}
                src={require("./face.jpg")}
                layout="fill"
                objectFit="cover" />
            </div>
          ))
        }
      </div>
    </div>
  )
}