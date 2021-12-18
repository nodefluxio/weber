import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { WarningDiv } from '@/elements/WarningDiv/WarningDiv'
import { getFileSizeWithUnit } from '@/utils/utils'

type Props = {
  images: string[]
  onPhotoDrop: (arg: string) => void
  maxSize: number
  acceptedFileFormat: string
}

export const DropzoneOptions = ({
  images,
  onPhotoDrop,
  maxSize,
  acceptedFileFormat
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
    <div className="w-full md:ml-11">
      <WarningDiv
        message={errorMsg}
        className="flex justify-center mb-2 text-center"
      />
      <div className="w-full mx-auto flex flex-col justify-center cursor-pointer md:flex-row lg:w-7/12">
        <div
          {...getRootProps()}
          className="w-full lg:w-[600px] h-[360px] border border-gray-300 relative 
          border-solid hover:border-primary-300 mb-3 md:mb-0 md:mr-3">
          <input {...getInputProps()} />
          {photos.length === 0 ? (
            <aside className="flex items-center justify-center w-full h-full">
              <p className="w-4/5 cursor-pointer font-serif text-center m-auto text-xl">
                {`Click or drag and drop image here or simply click on the given examples. Image is limited to ${getFileSizeWithUnit(
                  maxSize
                )} and ${parsedFileFormat} format`}
              </p>
            </aside>
          ) : (
            <aside className="w-full h-full">{preview}</aside>
          )}
        </div>
        <div className="flex flex-row flex-wrap md:flex-col">
          {images.map((imageName: string, i: number) => (
            <div
              className="w-16 h-16 relative cursor-pointer 
              hover:border-primary-300 border-2 mr-2 md:mr-0 md:mb-2"
              key={i}>
              {/* eslint-disable @next/next/no-img-element*/}
              <img
                className="w-full h-full bg-cover"
                onClick={(e: MouseEvent<HTMLImageElement>) => {
                  const img = e.target as HTMLImageElement
                  onChoose(img.src)
                }}
                src={imageName}
                alt={imageName}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
