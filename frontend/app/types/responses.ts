import {
  CarDamageRecomendation,
  CarDamageScore,
  CarDamageSeverity,
  CarDamageStatus,
  FaceLiveness,
  FaceMatch,
  OCRKTP,
  PaymentAccountInfo,
  Service
} from './elements'
import {
  FaceAttributeResultResponse,
  FaceOcclusionResultResponse
} from './results'

export type StandardResponse = {
  message: string
  ok: boolean
}

export interface ServicesGetResponse extends StandardResponse {
  data: Service[]
}

export interface VisitorsPostResponse extends StandardResponse {
  data: [
    {
      session_id: string
      max_age: number
    }
  ]
}

export interface ServiceBySlugResponse extends StandardResponse {
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

export interface NodefluxCloudResponse<T> extends StandardResponse {
  job: {
    id: string
    result: {
      analytic_type: string
      result: [T]
      status: string
    }
  }
}

export interface AnalyticsResponse<T> extends StandardResponse {
  service_data: NodefluxCloudResponse<T>
  thumbnails: Array<string>
}

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

export interface PassiveLiveness extends StandardResponse {
  service_data: NodefluxCloudResponse<{ face_liveness: FaceLiveness }>
}

export interface EKYCResultResponse extends StandardResponse {
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

export interface CheckLimitResponse extends StandardResponse {
  data: [
    {
      full_name: string
      balance: number
      is_limit: boolean
      have_twin: boolean
    }
  ]
}

export interface CheckAccountResponse extends StandardResponse {
  data: PaymentAccountInfo
}

export type InnovationResponse<T> = {
  message: string
  ok: boolean
  service_data: {
    job: {
      result: {
        analytic_type: string
        result: T[]
        status: string
      }
    }
    message: string
    ok: boolean
  }
}

export interface FaceOcclusionAttributeResponse extends StandardResponse {
  service_data: {
    face_occlusion: NodefluxCloudResponse<FaceOcclusionResultResponse>
    face_attribute: NodefluxCloudResponse<FaceAttributeResultResponse>
  }
}

export type CarDamageResponse = {
  car_damage_assessment: {
    damage: CarDamageStatus
    damage_confidence: number
    score: CarDamageScore
    severity: CarDamageSeverity
    severity_confidence: number
  }[]
  total_score: number
  recommendation: CarDamageRecomendation
}
