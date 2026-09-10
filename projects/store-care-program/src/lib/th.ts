// Thai user-facing strings for Store Care Program v1.
//
// The tech-stack decision fixes the v1 UI as Thai-only: hardcoded Thai strings,
// no i18n library. Code, schema, and technical docs stay in English. If a
// bilingual UI is ever needed, that is an additive change (next-intl).

import type {
  FollowUpType,
  IssueBucket,
  IssueEventReasonKind,
  IssueStatus,
} from "@/types/domain";

export const APP_NAME = "ระบบดูแลร้านค้า";

export const t = {
  appName: APP_NAME,
  tagline: "ติดตามปัญหาหน้าร้านให้มีเจ้าของ มีกำหนดเสร็จ และปิดงานได้จริง",

  nav: {
    stores: "ร้านค้า",
    manage: "มุมมองผู้บริหาร",
    signOut: "ออกจากระบบ",
  },

  common: {
    save: "บันทึก",
    saving: "กำลังบันทึก…",
    cancel: "ยกเลิก",
    back: "ย้อนกลับ",
    required: "จำเป็น",
    optional: "ไม่บังคับ",
    none: "—",
    loading: "กำลังโหลด…",
    createdAt: "บันทึกเมื่อ",
  },

  errors: {
    configMissing:
      "ยังไม่ได้ตั้งค่าการเชื่อมต่อระบบ (Supabase). ผู้ดูแลระบบต้องตั้งค่าก่อนใช้งาน",
    domainNotConfigured:
      "ยังไม่ได้กำหนดโดเมนอีเมลที่อนุญาต ผู้ดูแลระบบต้องตั้งค่า ALLOWED_EMAIL_DOMAIN ก่อนเข้าสู่ระบบ",
    notAuthorised:
      "อีเมลนี้ไม่ได้อยู่ในโดเมนที่อนุญาต จึงไม่สามารถเข้าใช้งานระบบได้",
    signInFailed: "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
    forbidden: "บัญชีนี้ไม่มีสิทธิ์ทำรายการนี้ (ต้องเป็นผู้ใช้งานฝ่ายปฏิบัติการ)",
    notSignedIn: "กรุณาเข้าสู่ระบบก่อน",
    userRecordMissing:
      "ไม่พบข้อมูลผู้ใช้ในระบบ กรุณาออกจากระบบแล้วเข้าสู่ระบบใหม่ หากยังพบปัญหาให้แจ้งผู้ดูแลระบบ",
    notFound: "ไม่พบข้อมูลที่ต้องการ",
    generic: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    fieldRequired: "กรุณากรอกข้อมูลในช่องนี้",
    reasonRequired: "กรุณาระบุเหตุผลสำหรับการเปลี่ยนสถานะนี้",
    transitionNotAllowed: "ไม่สามารถเปลี่ยนสถานะแบบนี้ได้",
  },

  login: {
    title: "เข้าสู่ระบบ",
    intro: "เข้าสู่ระบบด้วยบัญชี Google ขององค์กร",
    google: "เข้าสู่ระบบด้วย Google",
  },

  stores: {
    title: "ร้านค้า",
    empty: "ยังไม่มีร้านค้าในระบบ",
    add: "เพิ่มร้านค้า",
    addTitle: "เพิ่มร้านค้าใหม่",
    name: "ชื่อร้าน / รหัสร้าน",
    channel: "ช่องทาง / บัญชี",
    location: "ที่ตั้ง",
    contact: "ผู้ติดต่อ / ผู้รับผิดชอบ (ถ้ามี)",
    detailTitle: "ข้อมูลร้านค้า",
    followUpsHeading: "การติดตามร้านค้า",
    issuesHeading: "ปัญหา / งานที่ต้องทำ",
    noFollowUps: "ยังไม่มีการติดตาม",
    noIssues: "ยังไม่มีปัญหา / งาน",
    recordFollowUp: "บันทึกการติดตาม",
    createIssue: "สร้างปัญหา / งาน",
  },

  followUp: {
    title: "บันทึกการติดตามร้านค้า",
    store: "ร้านค้า",
    activityDate: "วันที่ติดตาม",
    activityDateHint: "ใส่วันที่ที่ติดตามจริง ย้อนหลังได้",
    type: "ประเภทการติดตาม",
    performedBy: "ผู้ที่ติดตาม",
    performedByHint: "ชื่อผู้ที่ติดตามจริง (อาจไม่ใช่ผู้บันทึก)",
    notes: "บันทึก / สิ่งที่พบ",
    notesHint: "บันทึกสิ่งที่พบเป็นข้อความอิสระ",
    saved: "บันทึกการติดตามแล้ว",
    createIssueFromThis: "สร้างปัญหา / งานจากการติดตามนี้",
  },

  issue: {
    newTitle: "สร้างปัญหา / งาน",
    detailTitle: "รายละเอียดปัญหา / งาน",
    store: "ร้านค้า",
    fromFollowUp: "จากการติดตามเมื่อ",
    notFromFollowUp: "สร้างโดยตรง (ไม่ผูกกับการติดตาม)",
    description: "รายละเอียดปัญหา / งาน",
    owner: "ผู้รับผิดชอบ",
    ownerHint: "เลือกผู้ใช้ในระบบ หรือพิมพ์ชื่อผู้ที่ไม่ได้ใช้ระบบ",
    ownerPickUser: "เลือกจากผู้ใช้ในระบบ",
    ownerTypeName: "พิมพ์ชื่อ",
    ownerNamePlaceholder: "ชื่อผู้รับผิดชอบ",
    dueDate: "กำหนดเสร็จ",
    status: "สถานะ",
    createdBy: "ผู้บันทึก",
    created: "สร้างปัญหา / งานแล้ว",
    history: "ประวัติการเปลี่ยนสถานะ",
    changeStatus: "เปลี่ยนสถานะเป็น",
    reasonLabels: {
      resolution: "บันทึกการแก้ไข (สิ่งที่เปลี่ยน / วิธีแก้)",
      cancellation: "เหตุผลที่ยกเลิก",
      reopen: "เหตุผลที่เปิดใหม่",
    } satisfies Record<IssueEventReasonKind, string>,
    terminal: "สถานะนี้เป็นสถานะสิ้นสุด ไม่สามารถเปลี่ยนต่อได้",
    reopenAction: "เปิดปัญหานี้ใหม่",
  },

  manage: {
    title: "มุมมองผู้บริหาร",
    subtitle: "ปัญหา / งานทั้งหมด แยกตามร้านค้า (ดูอย่างเดียว)",
    empty: "ยังไม่มีปัญหา / งานในระบบ",
    buckets: {
      active: "กำลังดำเนินการ",
      overdue: "เกินกำหนด",
      resolved: "แก้ไขแล้ว",
    },
    dueOn: "กำหนดเสร็จ",
    owner: "ผู้รับผิดชอบ",
  },
} as const;

export const FOLLOW_UP_TYPE_LABELS: Record<FollowUpType, string> = {
  in_person: "ไปหน้าร้าน",
  phone: "โทรศัพท์",
  chat: "แชท / ข้อความ",
  other: "อื่น ๆ",
};

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  open: "เปิด",
  in_progress: "กำลังดำเนินการ",
  waiting: "รอปัจจัยอื่น",
  resolved: "แก้ไขแล้ว",
  cancelled: "ยกเลิก",
};

export const ISSUE_BUCKET_LABELS: Record<IssueBucket, string> = {
  active: "กำลังดำเนินการ",
  overdue: "เกินกำหนด",
  resolved: "แก้ไขแล้ว",
  cancelled: "ยกเลิก",
};
