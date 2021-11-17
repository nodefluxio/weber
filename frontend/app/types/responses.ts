import { FaceLiveness, FaceMatch, OCRKTP, Service } from './elements'

type StandardResponse = {
  message: string
  ok: boolean
}

export type ServicesGetResponse = {
  data: Service[]
  message: string
  ok: boolean
}

export type VisitorsPostResponse = {
  data: [
    {
      session_id: string
      max_age: number
    }
  ]
  message: string
  ok: boolean
}

export type VisitorsPostErrorResponse = StandardResponse
export type ActivitiesPostResponse = StandardResponse

export type ServiceBySlugResponse = {
  data: {
    id: number
    type: string
    slug: string
    name: string
    short_description: string
    long_description: string
    thumbnail: string
    created_at: string
    updated_at: string
  }
  message: string
  ok: boolean
}
export type ServiceBySlugResponseData = {
  id: number
  type: string
  slug: string
  name: string
  short_description: string
  long_description: string
  thumbnail: string
  created_at: string
  updated_at: string
}

export type ServiceByIdErrorResponse = StandardResponse

export type NodefluxCloudResponse<AnalyticsResultResponse> = {
  job: {
    result: {
      analytic_type: string
      result: [AnalyticsResultResponse]
      status: string
    }
  }
  message: string
  ok: boolean
}

export type AnalyticsResponse<AnalyticsResultResponse> = {
  message: string
  ok: boolean
  service_data: {
    job: {
      result: {
        analytic_type: string
        result: [AnalyticsResultResponse]
        status: string
      }
    }
  }
  thumbnails: Array<string>
}

export type AnalyticsError = StandardResponse

export type ReviewResponse = StandardResponse

export type OCRResultResponse = {
  agama: string
  alamat: string
  berlaku_hingga: string
  golongan_darah: string
  jenis_kelamin: string
  kabupaten_kota: string
  kecamatan: string
  kelurahan_desa: string
  kewarganegaraan: string
  nama: string
  nik: string
  pekerjaan: string
  provinsi: string
  rt_rw: string
  status_perkawinan: string
  tanggal_lahir: string
  tempat_lahir: string
}

export type LPRResultResponse = {
  license_plate_recognitions: [
    {
      bounding_box: {
        height: number
        left: number
        top: number
        width: number
      }
      confidence: number
      detected: boolean
      license_plate_number: string
    }
  ]
}

export type FMEResultResponse = {
  face_match: {
    match: boolean
    similarity: number
  }
}

export type EKYCResultResponse = {
  message: string
  ok: boolean
  service_data: {
    face_liveness: NodefluxCloudResponse<{ face_liveness: FaceLiveness }>
    ocr_ktp: NodefluxCloudResponse<OCRKTP>
    face_match: NodefluxCloudResponse<{ face_match: FaceMatch }>
  }
}

export type AnyResultResponse =
  | FMEResultResponse
  | OCRResultResponse
  | LPRResultResponse

export type PhoneNumberResponse = StandardResponse
export type ActivationResponse = StandardResponse
export type PaymentResponse = {
  ok: boolean
  error?: number
  message: string
}
export type CheckAccountResponse = {
  have_active_account: boolean,
  message: string,
  ok: boolean
}