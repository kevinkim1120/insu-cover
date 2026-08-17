const DEFAULT_CLIENTS = [
  { id: "client-1", name: "김창완", rrn: "791120-1", gender: "남", age: 47, color: "#4f46e5", sortOrder: 1 },
  { id: "client-3", name: "박상미", rrn: "790505-2", gender: "여", age: 47, color: "#ec4899", sortOrder: 2 },
  { id: "client-5", name: "김태희", rrn: "121010-4", gender: "여", age: 14, color: "#06b6d4", sortOrder: 3 },
  { id: "client-6", name: "김민준", rrn: "141212-3", gender: "남", age: 12, color: "#f59e0b", sortOrder: 4 },
  { id: "client-2", name: "오외점", rrn: "570303-2", gender: "여", age: 69, color: "#8b5cf6", sortOrder: 5 },
  { id: "client-4", name: "박창배", rrn: "550202-1", gender: "남", age: 71, color: "#10b981", sortOrder: 6 }
];

const DEFAULT_CONTRACTS = [
  // 김창완 (10 건)
  { id: "con-cw-1", clientId: "client-1", company: "한화생명", productName: "기본형실손(갱)(2형선택Ⅱ,질병입원)(무)", policyNumber: "178083732", contractDate: "2026.01.25", paymentPeriod: "1년납 / 100세", isRenewable: "1년 갱신", premium: 23646, paymentMethod: "자동이체" },
  { id: "con-cw-2", clientId: "client-1", company: "한화생명", productName: "미래로기업복지(1종)", policyNumber: "540810076", contractDate: "2023.01.20", paymentPeriod: "10년납 / 종신", isRenewable: "비갱신", premium: 300000, paymentMethod: "자동이체" },
  { id: "con-cw-3", clientId: "client-1", company: "KDB생명", productName: "(무)메디케어건강의료보험Ⅱ 1종만기환급형", policyNumber: "5679937010013", contractDate: "2007.01.29", paymentPeriod: "20년납 / 53년", isRenewable: "비갱신", premium: 40200, paymentMethod: "자동이체" },
  { id: "con-cw-4", clientId: "client-1", company: "KDB생명", productName: "(무)베스트유니버셜종신보험(우량체-월납)", policyNumber: "5679937010018", contractDate: "2007.03.28", paymentPeriod: "20년납 / 종신", isRenewable: "비갱신", premium: 135500, paymentMethod: "자동이체" },
  { id: "con-cw-5", clientId: "client-1", company: "교보라이프플래닛", productName: "(무)교보라플 비갱신암보험(해약환급금 미지급형)", policyNumber: "26020009895", contractDate: "2026.02.18", paymentPeriod: "20년납 / 44년", isRenewable: "비갱신", premium: 54960, paymentMethod: "신용카드" },
  { id: "con-cw-8", clientId: "client-1", company: "한화생명", productName: "(무)엔터프라이즈", policyNumber: "520165300", contractDate: "2013.01.21", paymentPeriod: "10년납 / 종신", isRenewable: "비갱신", premium: 0, paymentMethod: "완납" },
  { id: "con-cw-9", clientId: "client-1", company: "한화생명", productName: "기업복지라이프(무)", policyNumber: "543488008", contractDate: "2026.06.01", paymentPeriod: "1년납 / 1년", isRenewable: "비갱신", premium: 0, paymentMethod: "완납" },
  { id: "con-cw-10", clientId: "client-1", company: "미래에셋생명", productName: "무배당 마이닥터건강보험", policyNumber: "3120405905", contractDate: "2000.10.06", paymentPeriod: "5년납 / 59년", isRenewable: "비갱신", premium: 0, paymentMethod: "완납" },
  { id: "con-cw-11", clientId: "client-1", company: "KDB생명", productName: "(연금저축)자유적립연금보험", policyNumber: "5679937010004", contractDate: "2006.12.22", paymentPeriod: "10년납 / 종신", isRenewable: "비갱신", premium: 0, paymentMethod: "완납" },
  { id: "con-cw-13", clientId: "client-1", company: "미래에셋생명", productName: "[직접입력] 무)암보장플러스", policyNumber: "직접입력", contractDate: "1999.12.02", paymentPeriod: "10년납 / 80세", isRenewable: "비갱신", premium: 0, paymentMethod: "완납" },

  // 오외점 (5 건)
  { id: "con-wj-1", clientId: "client-2", company: "한화생명", productName: "간편가입 건강(갱신형)(무)", policyNumber: "178076755", contractDate: "2018.01.24", paymentPeriod: "10년납 / 100세", isRenewable: "10년 갱신", premium: 17098, paymentMethod: "신용카드" },
  { id: "con-wj-2", clientId: "client-2", company: "KDB생명", productName: "(무)메디케어건강의료보험Ⅱ 1종만기환급형", policyNumber: "5830297010008", contractDate: "2007.01.18", paymentPeriod: "20년납 / 30년", isRenewable: "비갱신", premium: 49300, paymentMethod: "자동이체" },
  { id: "con-wj-3", clientId: "client-2", company: "KDB생명", productName: "(무)Standby실버케어보험3종(실버종신형)", policyNumber: "5830297010015", contractDate: "2007.01.18", paymentPeriod: "20년납 / 종신", isRenewable: "비갱신", premium: 62300, paymentMethod: "자동이체" },
  { id: "con-wj-4", clientId: "client-2", company: "삼성화재", productName: "무배당 삼성화재 운전자보험 안전운전 파트", policyNumber: "51615392460000", contractDate: "2016.10.27", paymentPeriod: "10년납 / 20년", isRenewable: "비갱신", premium: 50550, paymentMethod: "신용카드" },
  { id: "con-wj-5", clientId: "client-2", company: "NH농협생명", productName: "농업인NH안전보험(무배당) 기본형 (일반1형)", policyNumber: "3181679965373", contractDate: "2026.03.23", paymentPeriod: "1년납 / 1년", isRenewable: "비갱신", premium: 0, paymentMethod: "농협계좌" },

  // 박상미 (4 건)
  { id: "con-sm-1", clientId: "client-3", company: "한화생명", productName: "플러스저축(무)", policyNumber: "178038341", contractDate: "2018.01.18", paymentPeriod: "10년납 / 12년", isRenewable: "비갱신", premium: 250000, paymentMethod: "자동이체" },
  { id: "con-sm-2", clientId: "client-3", company: "한화생명", productName: "e암보험(비갱신)(무)", policyNumber: "208945470", contractDate: "2025.10.26", paymentPeriod: "60세납 / 80세", isRenewable: "비갱신", premium: 44040, paymentMethod: "신한카드" },
  { id: "con-sm-3", clientId: "client-3", company: "메리츠화재", productName: "무배당 알파Plus보장보험0808", policyNumber: "6A5203521", contractDate: "2009.03.31", paymentPeriod: "20년납 / 71년", isRenewable: "비갱신", premium: 90070, paymentMethod: "국민은행" },
  { id: "con-sm-4", clientId: "client-3", company: "미래에셋생명", productName: "무배당 마이닥터건강보험", policyNumber: "7000004706", contractDate: "2001.11.14", paymentPeriod: "10년납 / 58년", isRenewable: "비갱신", premium: 0, paymentMethod: "완납" },

  // 박창배 (2 건)
  { id: "con-cb-1", clientId: "client-4", company: "한화생명", productName: "간편가입 건강(갱신형)(무)", policyNumber: "178057577", contractDate: "2018.01.29", paymentPeriod: "10년납 / 100세", isRenewable: "10년 갱신", premium: 45986, paymentMethod: "자동이체" },
  { id: "con-cb-2", clientId: "client-4", company: "한화생명", productName: "플러스저축(무)", policyNumber: "178073391", contractDate: "2018.01.29", paymentPeriod: "10년납 / 15년", isRenewable: "비갱신", premium: 220000, paymentMethod: "자동이체" },

  // 김태희 (1 건)
  { id: "con-th-1", clientId: "client-5", company: "한화생명", productName: "한화생명어린이(무)", policyNumber: "178080444", contractDate: "2018.01.29", paymentPeriod: "20년납 / 100세", isRenewable: "비갱신", premium: 41646, paymentMethod: "자동이체" }
];

const DEFAULT_COVERAGES = [
  // ----------------------------------------------------
  // 김창완 (client-1) 보장 상세
  // ----------------------------------------------------
  { id: "cov-cw-1", clientId: "client-1", contractId: "con-cw-1", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "질병·상해 실손의료비", coverageAmount: "입원 5천 / 통원 30만", remarks: "4세대 실손 (자기부담 20~30%)" },
  { id: "cov-cw-2", clientId: "client-1", contractId: "con-cw-1", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "비급여(도수치료) 특약", coverageAmount: "350만", remarks: "연간 50회 한도" },
  { id: "cov-cw-3", clientId: "client-1", contractId: "con-cw-1", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "비급여(주사료) 특약", coverageAmount: "250만", remarks: "연간 50회 한도" },
  { id: "cov-cw-4", clientId: "client-1", contractId: "con-cw-1", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "비급여(MRI) 특약", coverageAmount: "300만", remarks: "연간 300만 한도" },
  { id: "cov-cw-5", clientId: "client-1", contractId: "con-cw-2", largeCategory: "사망/장해", mediumCategory: "일반사망", smallCategory: "일반사망보험금", coverageAmount: "1,302만", remarks: "주계약" },
  { id: "cov-cw-6", clientId: "client-1", contractId: "con-cw-2", largeCategory: "사망/장해", mediumCategory: "질병사망", smallCategory: "질병사망보험금", coverageAmount: "1,302만", remarks: "-" },
  { id: "cov-cw-7", clientId: "client-1", contractId: "con-cw-2", largeCategory: "사망/장해", mediumCategory: "암사망", smallCategory: "암사망보험금", coverageAmount: "1,302만", remarks: "-" },
  { id: "cov-cw-8", clientId: "client-1", contractId: "con-cw-2", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "재해사망보험금", coverageAmount: "1,302만", remarks: "-" },
  { id: "cov-cw-9", clientId: "client-1", contractId: "con-cw-2", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "교통재해사망보험금", coverageAmount: "1,302만", remarks: "-" },
  { id: "cov-cw-10", clientId: "client-1", contractId: "con-cw-3", largeCategory: "뇌", mediumCategory: "뇌출혈", smallCategory: "뇌출혈 진단비", coverageAmount: "2,000만", remarks: "53년만기" },
  { id: "cov-cw-11", clientId: "client-1", contractId: "con-cw-3", largeCategory: "심장", mediumCategory: "급성심근경색", smallCategory: "급성심근경색증 진단비", coverageAmount: "2,000만", remarks: "⚠️ 협심증 보장 제외" },
  { id: "cov-cw-12", clientId: "client-1", contractId: "con-cw-3", largeCategory: "치아/골절", mediumCategory: "골절", smallCategory: "골절진단비", coverageAmount: "20만", remarks: "-" },
  { id: "cov-cw-13", clientId: "client-1", contractId: "con-cw-3", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "일반수술비 (1종)", coverageAmount: "10만", remarks: "-" },
  { id: "cov-cw-14", clientId: "client-1", contractId: "con-cw-3", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "일반수술비 (5종/3종)", coverageAmount: "500만", remarks: "-" },
  { id: "cov-cw-15", clientId: "client-1", contractId: "con-cw-3", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "질병수술비", coverageAmount: "10만", remarks: "-" },
  { id: "cov-cw-16", clientId: "client-1", contractId: "con-cw-3", largeCategory: "암", mediumCategory: "암수술", smallCategory: "암수술비", coverageAmount: "500만", remarks: "-" },
  { id: "cov-cw-17", clientId: "client-1", contractId: "con-cw-3", largeCategory: "뇌", mediumCategory: "뇌혈관 치료", smallCategory: "뇌혈관질환수술비", coverageAmount: "300만", remarks: "-" },
  { id: "cov-cw-18", clientId: "client-1", contractId: "con-cw-3", largeCategory: "심장", mediumCategory: "허혈/심혈관 치료", smallCategory: "허혈성심장질환수술비", coverageAmount: "300만", remarks: "-" },
  { id: "cov-cw-19", clientId: "client-1", contractId: "con-cw-3", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "재해수술비", coverageAmount: "10만", remarks: "-" },
  { id: "cov-cw-20", clientId: "client-1", contractId: "con-cw-3", largeCategory: "수술/입원", mediumCategory: "입원일당", smallCategory: "질병입원비 (4일이상)", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-cw-21", clientId: "client-1", contractId: "con-cw-3", largeCategory: "암", mediumCategory: "암입원", smallCategory: "암입원비", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-cw-22", clientId: "client-1", contractId: "con-cw-3", largeCategory: "뇌", mediumCategory: "뇌혈관", smallCategory: "뇌혈관질환입원비", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-cw-23", clientId: "client-1", contractId: "con-cw-3", largeCategory: "심장", mediumCategory: "허혈/심혈관", smallCategory: "허혈성심장질환입원비", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-cw-24", clientId: "client-1", contractId: "con-cw-4", largeCategory: "사망/장해", mediumCategory: "일반사망", smallCategory: "일반사망보험금", coverageAmount: "1억", remarks: "-" },
  { id: "cov-cw-25", clientId: "client-1", contractId: "con-cw-4", largeCategory: "사망/장해", mediumCategory: "질병사망", smallCategory: "질병사망보험금", coverageAmount: "1억", remarks: "-" },
  { id: "cov-cw-26", clientId: "client-1", contractId: "con-cw-4", largeCategory: "사망/장해", mediumCategory: "암사망", smallCategory: "암사망보험금", coverageAmount: "1억", remarks: "-" },
  { id: "cov-cw-27", clientId: "client-1", contractId: "con-cw-4", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "재해사망보험금", coverageAmount: "1.5억", remarks: "-" },
  { id: "cov-cw-28", clientId: "client-1", contractId: "con-cw-4", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "교통재해사망보험금", coverageAmount: "1.5억", remarks: "-" },
  { id: "cov-cw-29", clientId: "client-1", contractId: "con-cw-4", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해후유장해 (79%미만)", coverageAmount: "11,850만", remarks: "3~79% 장해지급률 곱한 금액" },
  { id: "cov-cw-30", clientId: "client-1", contractId: "con-cw-4", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통후유장해 (79%미만)", coverageAmount: "11,850만", remarks: "-" },
  { id: "cov-cw-31", clientId: "client-1", contractId: "con-cw-4", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해후유장해 (3%이상)", coverageAmount: "450만", remarks: "-" },
  { id: "cov-cw-32", clientId: "client-1", contractId: "con-cw-4", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통후유장해 (3%이상)", coverageAmount: "450만", remarks: "-" },
  { id: "cov-cw-33", clientId: "client-1", contractId: "con-cw-5", largeCategory: "암", mediumCategory: "일반암", smallCategory: "일반암 진단비", coverageAmount: "3,000만", remarks: "-" },
  { id: "cov-cw-34", clientId: "client-1", contractId: "con-cw-5", largeCategory: "암", mediumCategory: "고액암", smallCategory: "고액암 진단비", coverageAmount: "3,000만", remarks: "뼈, 뇌, 백혈병 등" },
  { id: "cov-cw-45", clientId: "client-1", contractId: "con-cw-8", largeCategory: "사망/장해", mediumCategory: "일반사망", smallCategory: "일반사망보험금", coverageAmount: "4,579만", remarks: "완납 주계약" },
  { id: "cov-cw-46", clientId: "client-1", contractId: "con-cw-8", largeCategory: "사망/장해", mediumCategory: "질병사망", smallCategory: "질병사망보험금", coverageAmount: "4,579만", remarks: "완납" },
  { id: "cov-cw-47", clientId: "client-1", contractId: "con-cw-8", largeCategory: "사망/장해", mediumCategory: "암사망", smallCategory: "암사망보험금", coverageAmount: "4,579만", remarks: "완납" },
  { id: "cov-cw-47a", clientId: "client-1", contractId: "con-cw-8", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "재해사망보험금", coverageAmount: "4,579만", remarks: "완납" },
  { id: "cov-cw-47b", clientId: "client-1", contractId: "con-cw-8", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "교통재해사망보험금", coverageAmount: "4,579만", remarks: "완납" },
  { id: "cov-cw-48", clientId: "client-1", contractId: "con-cw-9", largeCategory: "사망/장해", mediumCategory: "질병사망", smallCategory: "질병사망보험금", coverageAmount: "3억", remarks: "완납" },
  { id: "cov-cw-48a", clientId: "client-1", contractId: "con-cw-9", largeCategory: "사망/장해", mediumCategory: "암사망", smallCategory: "암사망보험금", coverageAmount: "3억", remarks: "완납" },
  { id: "cov-cw-48b", clientId: "client-1", contractId: "con-cw-9", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "재해사망보험금", coverageAmount: "3억", remarks: "완납" },
  { id: "cov-cw-48c", clientId: "client-1", contractId: "con-cw-9", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "교통재해사망보험금", coverageAmount: "3억", remarks: "완납" },
  { id: "cov-cw-49", clientId: "client-1", contractId: "con-cw-9", largeCategory: "암", mediumCategory: "일반암", smallCategory: "일반암 진단비", coverageAmount: "2,000만", remarks: "완납" },
  { id: "cov-cw-49a", clientId: "client-1", contractId: "con-cw-9", largeCategory: "암", mediumCategory: "고액암", smallCategory: "고액암 진단비", coverageAmount: "2,000만", remarks: "완납" },
  { id: "cov-cw-50", clientId: "client-1", contractId: "con-cw-9", largeCategory: "뇌", mediumCategory: "뇌출혈", smallCategory: "뇌출혈 진단비", coverageAmount: "2,000만", remarks: "완납" },
  { id: "cov-cw-51", clientId: "client-1", contractId: "con-cw-9", largeCategory: "뇌", mediumCategory: "뇌혈관", smallCategory: "재진단뇌출혈 진단비", coverageAmount: "2,000만", remarks: "완납" },
  { id: "cov-cw-52", clientId: "client-1", contractId: "con-cw-9", largeCategory: "심장", mediumCategory: "급성심근경색", smallCategory: "급성심근경색증 진단비", coverageAmount: "4,000만", remarks: "완납" },
  { id: "cov-cw-53", clientId: "client-1", contractId: "con-cw-9", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해고도장해(100%)", coverageAmount: "1.3억", remarks: "완납" },
  { id: "cov-cw-54", clientId: "client-1", contractId: "con-cw-9", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통고도장해(100%)", coverageAmount: "1.2억", remarks: "완납" },
  { id: "cov-cw-55", clientId: "client-1", contractId: "con-cw-9", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해후유장해 (79%미만)", coverageAmount: "790만", remarks: "완납" },
  { id: "cov-cw-56", clientId: "client-1", contractId: "con-cw-9", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해후유장해 (3%이상)", coverageAmount: "30만", remarks: "완납" },
  { id: "cov-cw-57", clientId: "client-1", contractId: "con-cw-10", largeCategory: "뇌", mediumCategory: "뇌졸중", smallCategory: "뇌졸중 진단비", coverageAmount: "1,500만", remarks: "⚠️ 뇌경색+뇌출혈만 보장 (기타뇌혈관 제외)" },
  { id: "cov-cw-58", clientId: "client-1", contractId: "con-cw-10", largeCategory: "뇌", mediumCategory: "뇌출혈", smallCategory: "뇌출혈 진단비", coverageAmount: "1,500만", remarks: "완납" },
  { id: "cov-cw-59", clientId: "client-1", contractId: "con-cw-10", largeCategory: "심장", mediumCategory: "급성심근경색", smallCategory: "급성심근경색증 진단비", coverageAmount: "1,500만", remarks: "⚠️ 협심증 보장 제외" },
  { id: "cov-cw-60", clientId: "client-1", contractId: "con-cw-10", largeCategory: "뇌", mediumCategory: "뇌혈관 치료", smallCategory: "뇌혈관질환수술비", coverageAmount: "500만", remarks: "완납" },
  { id: "cov-cw-61", clientId: "client-1", contractId: "con-cw-10", largeCategory: "심장", mediumCategory: "허혈/심혈관 치료", smallCategory: "허혈성심장질환수술비", coverageAmount: "500만", remarks: "완납" },
  { id: "cov-cw-62", clientId: "client-1", contractId: "con-cw-10", largeCategory: "뇌", mediumCategory: "뇌혈관", smallCategory: "뇌혈관질환입원비", coverageAmount: "4만/일", remarks: "완납" },
  { id: "cov-cw-63", clientId: "client-1", contractId: "con-cw-10", largeCategory: "심장", mediumCategory: "허혈/심혈관", smallCategory: "허혈성심장질환입원비", coverageAmount: "4만/일", remarks: "완납" },
  { id: "cov-cw-64", clientId: "client-1", contractId: "con-cw-13", largeCategory: "암", mediumCategory: "일반암", smallCategory: "일반암 진단비", coverageAmount: "2,000만", remarks: "완납" },
  { id: "cov-cw-65", clientId: "client-1", contractId: "con-cw-13", largeCategory: "암", mediumCategory: "고액암", smallCategory: "고액암 진단비", coverageAmount: "2,000만", remarks: "완납" },
  { id: "cov-cw-66", clientId: "client-1", contractId: "con-cw-13", largeCategory: "암", mediumCategory: "암 치료", smallCategory: "암통원비", coverageAmount: "4만/일", remarks: "완납" },
  { id: "cov-cw-67", clientId: "client-1", contractId: "con-cw-13", largeCategory: "암", mediumCategory: "암수술", smallCategory: "암수술비", coverageAmount: "600만", remarks: "완납" },
  { id: "cov-cw-68", clientId: "client-1", contractId: "con-cw-13", largeCategory: "암", mediumCategory: "암입원", smallCategory: "암입원비", coverageAmount: "10만/일", remarks: "완납" },

  // ----------------------------------------------------
  // 오외점 (client-2) 보장 상세
  // ----------------------------------------------------
  { id: "cov-wj-1", clientId: "client-2", contractId: "con-wj-1", largeCategory: "암", mediumCategory: "일반암", smallCategory: "일반암 진단비", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-wj-2", clientId: "client-2", contractId: "con-wj-1", largeCategory: "암", mediumCategory: "고액암", smallCategory: "고액암 진단비", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-wj-3", clientId: "client-2", contractId: "con-wj-1", largeCategory: "암", mediumCategory: "일반암", smallCategory: "유사암 진단비", coverageAmount: "200만", remarks: "-" },
  { id: "cov-wj-4", clientId: "client-2", contractId: "con-wj-2", largeCategory: "뇌", mediumCategory: "뇌출혈", smallCategory: "뇌출혈 진단비", coverageAmount: "2,000만", remarks: "30년만기" },
  { id: "cov-wj-5", clientId: "client-2", contractId: "con-wj-2", largeCategory: "심장", mediumCategory: "급성심근경색", smallCategory: "급성심근경색증 진단비", coverageAmount: "2,000만", remarks: "⚠️ 협심증 보장 제외" },
  { id: "cov-wj-6", clientId: "client-2", contractId: "con-wj-2", largeCategory: "뇌", mediumCategory: "뇌혈관 치료", smallCategory: "뇌혈관질환수술비", coverageAmount: "300만", remarks: "-" },
  { id: "cov-wj-7", clientId: "client-2", contractId: "con-wj-2", largeCategory: "심장", mediumCategory: "허혈/심혈관 치료", smallCategory: "허혈성심장질환수술비", coverageAmount: "300만", remarks: "-" },
  { id: "cov-wj-8", clientId: "client-2", contractId: "con-wj-3", largeCategory: "사망/장해", mediumCategory: "일반사망", smallCategory: "일반사망보험금", coverageAmount: "2,000만", remarks: "주계약" },
  { id: "cov-wj-9", clientId: "client-2", contractId: "con-wj-3", largeCategory: "사망/장해", mediumCategory: "질병사망", smallCategory: "질병사망보험금", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-wj-10", clientId: "client-2", contractId: "con-wj-3", largeCategory: "사망/장해", mediumCategory: "암사망", smallCategory: "암사망보험금", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-wj-11", clientId: "client-2", contractId: "con-wj-3", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "재해사망보험금", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-wj-12", clientId: "client-2", contractId: "con-wj-3", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "교통재해사망보험금", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-wj-13", clientId: "client-2", contractId: "con-wj-3", largeCategory: "치매/간병", mediumCategory: "치매", smallCategory: "중증치매(CDR3) 진단비", coverageAmount: "1,000만", remarks: "-" },
  { id: "cov-wj-14", clientId: "client-2", contractId: "con-wj-3", largeCategory: "치아/골절", mediumCategory: "골절", smallCategory: "골절진단비", coverageAmount: "20만", remarks: "-" },
  { id: "cov-wj-15", clientId: "client-2", contractId: "con-wj-3", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "일반수술비 (1종)", coverageAmount: "10만", remarks: "-" },
  { id: "cov-wj-16", clientId: "client-2", contractId: "con-wj-3", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "일반수술비 (5종/3종)", coverageAmount: "500만", remarks: "-" },
  { id: "cov-wj-17", clientId: "client-2", contractId: "con-wj-3", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "질병수술비", coverageAmount: "10만", remarks: "-" },
  { id: "cov-wj-18", clientId: "client-2", contractId: "con-wj-3", largeCategory: "암", mediumCategory: "암수술", smallCategory: "암수술비", coverageAmount: "500만", remarks: "-" },
  { id: "cov-wj-19", clientId: "client-2", contractId: "con-wj-3", largeCategory: "심장", mediumCategory: "허혈/심혈관 치료", smallCategory: "허혈성심장질환수술비", coverageAmount: "30만", remarks: "-" },
  { id: "cov-wj-20", clientId: "client-2", contractId: "con-wj-3", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "재해수술비", coverageAmount: "10만", remarks: "-" },
  { id: "cov-wj-21", clientId: "client-2", contractId: "con-wj-3", largeCategory: "수술/입원", mediumCategory: "입원일당", smallCategory: "질병입원비 (4일이상)", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-wj-22", clientId: "client-2", contractId: "con-wj-3", largeCategory: "암", mediumCategory: "암입원", smallCategory: "암입원비", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-wj-23", clientId: "client-2", contractId: "con-wj-3", largeCategory: "뇌", mediumCategory: "뇌혈관", smallCategory: "뇌혈관질환입원비", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-wj-24", clientId: "client-2", contractId: "con-wj-3", largeCategory: "심장", mediumCategory: "허혈/심혈관", smallCategory: "허혈성심장질환입원비", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-wj-25", clientId: "client-2", contractId: "con-wj-3", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해후유장해 (79%미만)", coverageAmount: "1,580만", remarks: "-" },
  { id: "cov-wj-26", clientId: "client-2", contractId: "con-wj-3", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통후유장해 (79%미만)", coverageAmount: "1,580만", remarks: "-" },
  { id: "cov-wj-27", clientId: "client-2", contractId: "con-wj-3", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해후유장해 (3%이상)", coverageAmount: "60만", remarks: "-" },
  { id: "cov-wj-28", clientId: "client-2", contractId: "con-wj-3", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통후유장해 (3%이상)", coverageAmount: "60만", remarks: "-" },
  { id: "cov-wj-29", clientId: "client-2", contractId: "con-wj-4", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "재해사망보험금", coverageAmount: "1,000만", remarks: "-" },
  { id: "cov-wj-30", clientId: "client-2", contractId: "con-wj-4", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "교통재해사망보험금", coverageAmount: "1,000만", remarks: "-" },
  { id: "cov-wj-31", clientId: "client-2", contractId: "con-wj-4", largeCategory: "치아/골절", mediumCategory: "골절", smallCategory: "골절진단비", coverageAmount: "100만", remarks: "-" },
  { id: "cov-wj-32", clientId: "client-2", contractId: "con-wj-4", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "화상진단비", coverageAmount: "20만", remarks: "-" },
  { id: "cov-wj-33", clientId: "client-2", contractId: "con-wj-4", largeCategory: "수술/입원", mediumCategory: "입원일당", smallCategory: "상해입원비 (1일이상)", coverageAmount: "1만/일", remarks: "-" },
  { id: "cov-wj-34", clientId: "client-2", contractId: "con-wj-4", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해고도장해(100%)", coverageAmount: "1,000만", remarks: "-" },
  { id: "cov-wj-35", clientId: "client-2", contractId: "con-wj-4", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통고도장해(100%)", coverageAmount: "1,000만", remarks: "-" },
  { id: "cov-wj-36", clientId: "client-2", contractId: "con-wj-4", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "자동차부상발생금", coverageAmount: "1,100만", remarks: "-" },

  // ----------------------------------------------------
  // 박상미 (client-3) 보장 상세
  // ----------------------------------------------------
  // 플러스저축(con-sm-1)
  { id: "cov-sm-1", clientId: "client-3", contractId: "con-sm-1", largeCategory: "사망/장해", mediumCategory: "일반사망", smallCategory: "일반사망보험금", coverageAmount: "2,779만", remarks: "주계약" },
  { id: "cov-sm-2", clientId: "client-3", contractId: "con-sm-1", largeCategory: "사망/장해", mediumCategory: "질병사망", smallCategory: "질병사망보험금", coverageAmount: "2,779만", remarks: "-" },
  { id: "cov-sm-3", clientId: "client-3", contractId: "con-sm-1", largeCategory: "사망/장해", mediumCategory: "암사망", smallCategory: "암사망보험금", coverageAmount: "2,779만", remarks: "-" },
  { id: "cov-sm-4", clientId: "client-3", contractId: "con-sm-1", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "재해사망보험금", coverageAmount: "2,779만", remarks: "-" },
  { id: "cov-sm-5", clientId: "client-3", contractId: "con-sm-1", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "교통재해사망보험금", coverageAmount: "2,779만", remarks: "-" },
  
  // e암보험 (con-sm-2)
  { id: "cov-sm-6", clientId: "client-3", contractId: "con-sm-2", largeCategory: "암", mediumCategory: "일반암", smallCategory: "일반암 진단비", coverageAmount: "2,000만", remarks: "80세만기" },
  { id: "cov-sm-7", clientId: "client-3", contractId: "con-sm-2", largeCategory: "암", mediumCategory: "고액암", smallCategory: "고액암 진단비", coverageAmount: "4,000만", remarks: "-" },
  { id: "cov-sm-8", clientId: "client-3", contractId: "con-sm-2", largeCategory: "암", mediumCategory: "일반암", smallCategory: "유사암 진단비", coverageAmount: "400만", remarks: "-" },
  { id: "cov-sm-9", clientId: "client-3", contractId: "con-sm-2", largeCategory: "암", mediumCategory: "일반암", smallCategory: "소액암 진단비", coverageAmount: "1,200만", remarks: "-" },

  // 메리츠 알파Plus (con-sm-3)
  { id: "cov-sm-10", clientId: "client-3", contractId: "con-sm-3", largeCategory: "사망/장해", mediumCategory: "질병사망", smallCategory: "질병사망보험금", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-sm-11", clientId: "client-3", contractId: "con-sm-3", largeCategory: "사망/장해", mediumCategory: "암사망", smallCategory: "암사망보험금", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-sm-12", clientId: "client-3", contractId: "con-sm-3", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "재해사망보험금", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-sm-13", clientId: "client-3", contractId: "con-sm-3", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "교통재해사망보험금", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-sm-14", clientId: "client-3", contractId: "con-sm-3", largeCategory: "뇌", mediumCategory: "뇌졸중", smallCategory: "뇌졸중 진단비", coverageAmount: "1,000만", remarks: "⚠️ 뇌경색+뇌출혈만 보장" },
  { id: "cov-sm-15", clientId: "client-3", contractId: "con-sm-3", largeCategory: "뇌", mediumCategory: "뇌출혈", smallCategory: "뇌출혈 진단비", coverageAmount: "1,000만", remarks: "-" },
  { id: "cov-sm-16", clientId: "client-3", contractId: "con-sm-3", largeCategory: "심장", mediumCategory: "급성심근경색", smallCategory: "급성심근경색증 진단비", coverageAmount: "1,000만", remarks: "⚠️ 협심증 보장 제외" },
  { id: "cov-sm-17", clientId: "client-3", contractId: "con-sm-3", largeCategory: "치아/골절", mediumCategory: "골절", smallCategory: "골절진단비", coverageAmount: "20만", remarks: "-" },
  { id: "cov-sm-18", clientId: "client-3", contractId: "con-sm-3", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "화상진단비", coverageAmount: "20만", remarks: "-" },
  { id: "cov-sm-19", clientId: "client-3", contractId: "con-sm-3", largeCategory: "뇌", mediumCategory: "뇌혈관 치료", smallCategory: "뇌혈관질환수술비", coverageAmount: "200만", remarks: "-" },
  { id: "cov-sm-20", clientId: "client-3", contractId: "con-sm-3", largeCategory: "심장", mediumCategory: "허혈/심혈관 치료", smallCategory: "허혈성심장질환수술비", coverageAmount: "200만", remarks: "-" },
  { id: "cov-sm-21", clientId: "client-3", contractId: "con-sm-3", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "장기이식수술비", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-sm-22", clientId: "client-3", contractId: "con-sm-3", largeCategory: "수술/입원", mediumCategory: "입원일당", smallCategory: "질병입원비 (1일이상)", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-sm-23", clientId: "client-3", contractId: "con-sm-3", largeCategory: "암", mediumCategory: "암입원", smallCategory: "암입원비", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-sm-24", clientId: "client-3", contractId: "con-sm-3", largeCategory: "뇌", mediumCategory: "뇌혈관", smallCategory: "뇌혈관질환입원비", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-sm-25", clientId: "client-3", contractId: "con-sm-3", largeCategory: "심장", mediumCategory: "허혈/심혈관", smallCategory: "허혈성심장질환입원비", coverageAmount: "2만/일", remarks: "-" },
  { id: "cov-sm-26", clientId: "client-3", contractId: "con-sm-3", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해고도장해(100%)", coverageAmount: "1.2억", remarks: "-" },
  { id: "cov-sm-27", clientId: "client-3", contractId: "con-sm-3", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통고도장해(100%)", coverageAmount: "1.2억", remarks: "-" },
  { id: "cov-sm-28", clientId: "client-3", contractId: "con-sm-3", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해후유장해 (79%미만)", coverageAmount: "1,580만", remarks: "-" },
  { id: "cov-sm-29", clientId: "client-3", contractId: "con-sm-3", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통후유장해 (79%미만)", coverageAmount: "1,580만", remarks: "-" },
  { id: "cov-sm-30", clientId: "client-3", contractId: "con-sm-3", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해후유장해 (3%이상)", coverageAmount: "60만", remarks: "-" },
  { id: "cov-sm-31", clientId: "client-3", contractId: "con-sm-3", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통후유장해 (3%이상)", coverageAmount: "60만", remarks: "-" },
  { id: "cov-sm-32", clientId: "client-3", contractId: "con-sm-3", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "질병입원비 (실손)", coverageAmount: "1억", remarks: "자기부담금 차등" },
  { id: "cov-sm-33", clientId: "client-3", contractId: "con-sm-3", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "질병통원비 (실손)", coverageAmount: "30만", remarks: "-" },
  { id: "cov-sm-34", clientId: "client-3", contractId: "con-sm-3", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "상해입원비 (실손)", coverageAmount: "1,000만", remarks: "-" },

  // 미래에셋 마이닥터 (con-sm-4)
  { id: "cov-sm-35", clientId: "client-3", contractId: "con-sm-4", largeCategory: "뇌", mediumCategory: "뇌졸중", smallCategory: "뇌졸중 진단비", coverageAmount: "1,500만", remarks: "⚠️ 뇌경색+뇌출혈만 보장" },
  { id: "cov-sm-36", clientId: "client-3", contractId: "con-sm-4", largeCategory: "뇌", mediumCategory: "뇌출혈", smallCategory: "뇌출혈 진단비", coverageAmount: "1,500만", remarks: "완납" },
  { id: "cov-sm-37", clientId: "client-3", contractId: "con-sm-4", largeCategory: "심장", mediumCategory: "급성심근경색", smallCategory: "급성심근경색증 진단비", coverageAmount: "1,500만", remarks: "⚠️ 협심증 보장 제외" },
  { id: "cov-sm-38", clientId: "client-3", contractId: "con-sm-4", largeCategory: "뇌", mediumCategory: "뇌혈관 치료", smallCategory: "뇌혈관질환수술비", coverageAmount: "500만", remarks: "완납" },
  { id: "cov-sm-39", clientId: "client-3", contractId: "con-sm-4", largeCategory: "심장", mediumCategory: "허혈/심혈관 치료", smallCategory: "허혈성심장질환수술비", coverageAmount: "500만", remarks: "완납" },
  { id: "cov-sm-40", clientId: "client-3", contractId: "con-sm-4", largeCategory: "뇌", mediumCategory: "뇌혈관", smallCategory: "뇌혈관질환입원비", coverageAmount: "4만/일", remarks: "완납" },
  { id: "cov-sm-41", clientId: "client-3", contractId: "con-sm-4", largeCategory: "심장", mediumCategory: "허혈/심혈관", smallCategory: "허혈성심장질환입원비", coverageAmount: "4만/일", remarks: "완납" },

  // ----------------------------------------------------
  // 박창배 (client-4) 보장 상세
  // ----------------------------------------------------
  // 간편가입 건강(con-cb-1)
  { id: "cov-cb-1", clientId: "client-4", contractId: "con-cb-1", largeCategory: "암", mediumCategory: "일반암", smallCategory: "일반암 진단비", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-cb-2", clientId: "client-4", contractId: "con-cb-1", largeCategory: "암", mediumCategory: "고액암", smallCategory: "고액암 진단비", coverageAmount: "2,000만", remarks: "-" },
  { id: "cov-cb-3", clientId: "client-4", contractId: "con-cb-1", largeCategory: "암", mediumCategory: "일반암", smallCategory: "유사암 진단비", coverageAmount: "200만", remarks: "-" },
  
  // 플러스저축(con-cb-2)
  { id: "cov-cb-4", clientId: "client-4", contractId: "con-cb-2", largeCategory: "사망/장해", mediumCategory: "일반사망", smallCategory: "일반사망보험금", coverageAmount: "2,427만", remarks: "주계약" },
  { id: "cov-cb-5", clientId: "client-4", contractId: "con-cb-2", largeCategory: "사망/장해", mediumCategory: "질병사망", smallCategory: "질병사망보험금", coverageAmount: "2,427만", remarks: "-" },
  { id: "cov-cb-6", clientId: "client-4", contractId: "con-cb-2", largeCategory: "사망/장해", mediumCategory: "암사망", smallCategory: "암사망보험금", coverageAmount: "2,427만", remarks: "-" },
  { id: "cov-cb-7", clientId: "client-4", contractId: "con-cb-2", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "재해사망보험금", coverageAmount: "2,427만", remarks: "-" },
  { id: "cov-cb-8", clientId: "client-4", contractId: "con-cb-2", largeCategory: "사망/장해", mediumCategory: "상해사망", smallCategory: "교통재해사망보험금", coverageAmount: "2,427만", remarks: "-" },

  // ----------------------------------------------------
  // 김태희 (client-5) 보장 상세
  // ----------------------------------------------------
  // 한화생명어린이(con-th-1)
  { id: "cov-th-1", clientId: "client-5", contractId: "con-th-1", largeCategory: "암", mediumCategory: "일반암", smallCategory: "일반암 진단비", coverageAmount: "3,000만", remarks: "100세만기" },
  { id: "cov-th-2", clientId: "client-5", contractId: "con-th-1", largeCategory: "암", mediumCategory: "고액암", smallCategory: "고액암 진단비", coverageAmount: "9,000만", remarks: "백혈병, 골수암 등" },
  { id: "cov-th-3", clientId: "client-5", contractId: "con-th-1", largeCategory: "암", mediumCategory: "일반암", smallCategory: "유사암 진단비", coverageAmount: "180만", remarks: "-" },
  { id: "cov-th-4", clientId: "client-5", contractId: "con-th-1", largeCategory: "암", mediumCategory: "일반암", smallCategory: "소액암 진단비", coverageAmount: "1,500만", remarks: "-" },
  { id: "cov-th-5", clientId: "client-5", contractId: "con-th-1", largeCategory: "암", mediumCategory: "암 치료", smallCategory: "암통원비", coverageAmount: "1.8만/일", remarks: "-" },
  { id: "cov-th-6", clientId: "client-5", contractId: "con-th-1", largeCategory: "뇌", mediumCategory: "뇌출혈", smallCategory: "뇌출혈 진단비", coverageAmount: "1,800만", remarks: "-" },
  { id: "cov-th-7", clientId: "client-5", contractId: "con-th-1", largeCategory: "뇌", mediumCategory: "뇌혈관", smallCategory: "재진단뇌출혈 진단비", coverageAmount: "1,800만", remarks: "-" },
  { id: "cov-th-8", clientId: "client-5", contractId: "con-th-1", largeCategory: "심장", mediumCategory: "급성심근경색", smallCategory: "급성심근경색증 진단비", coverageAmount: "1,800만", remarks: "⚠️ 협심증 보장 제외" },
  { id: "cov-th-9", clientId: "client-5", contractId: "con-th-1", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "일반수술비 (1종)", coverageAmount: "10만", remarks: "-" },
  { id: "cov-th-10", clientId: "client-5", contractId: "con-th-1", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "일반수술비 (5종/3종)", coverageAmount: "300만", remarks: "-" },
  { id: "cov-th-11", clientId: "client-5", contractId: "con-th-1", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "질병수술비", coverageAmount: "10만", remarks: "-" },
  { id: "cov-th-12", clientId: "client-5", contractId: "con-th-1", largeCategory: "암", mediumCategory: "암수술", smallCategory: "암수술비", coverageAmount: "300만", remarks: "-" },
  { id: "cov-th-13", clientId: "client-5", contractId: "con-th-1", largeCategory: "뇌", mediumCategory: "뇌혈관 치료", smallCategory: "뇌혈관질환수술비", coverageAmount: "50만", remarks: "-" },
  { id: "cov-th-14", clientId: "client-5", contractId: "con-th-1", largeCategory: "심장", mediumCategory: "허혈/심혈관 치료", smallCategory: "허혈성심장질환수술비", coverageAmount: "50만", remarks: "-" },
  { id: "cov-th-15", clientId: "client-5", contractId: "con-th-1", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "장기이식수술비", coverageAmount: "600만", remarks: "-" },
  { id: "cov-th-16", clientId: "client-5", contractId: "con-th-1", largeCategory: "암", mediumCategory: "암수술", smallCategory: "암다빈치로봇수술비", coverageAmount: "300만", remarks: "-" },
  { id: "cov-th-17", clientId: "client-5", contractId: "con-th-1", largeCategory: "수술/입원", mediumCategory: "수술비", smallCategory: "재해수술비", coverageAmount: "10만", remarks: "-" },
  { id: "cov-th-18", clientId: "client-5", contractId: "con-th-1", largeCategory: "암", mediumCategory: "암입원", smallCategory: "암입원비", coverageAmount: "3만/일", remarks: "-" },
  { id: "cov-th-19", clientId: "client-5", contractId: "con-th-1", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해고도장해 (100%)", coverageAmount: "3,000만", remarks: "-" },
  { id: "cov-th-20", clientId: "client-5", contractId: "con-th-1", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통고도장해 (100%)", coverageAmount: "3,000만", remarks: "-" },
  { id: "cov-th-21", clientId: "client-5", contractId: "con-th-1", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해후유장해 (79%미만)", coverageAmount: "2,370만", remarks: "-" },
  { id: "cov-th-22", clientId: "client-5", contractId: "con-th-1", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통후유장해 (79%미만)", coverageAmount: "2,370만", remarks: "-" },
  { id: "cov-th-23", clientId: "client-5", contractId: "con-th-1", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "재해후유장해 (3%이상)", coverageAmount: "90만", remarks: "-" },
  { id: "cov-th-24", clientId: "client-5", contractId: "con-th-1", largeCategory: "사망/장해", mediumCategory: "후유장해", smallCategory: "교통후유장해 (3%이상)", coverageAmount: "90만", remarks: "-" },
  { id: "cov-th-25", clientId: "client-5", contractId: "con-th-1", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "질병입원비 (실손)", coverageAmount: "5,000만", remarks: "-" },
  { id: "cov-th-26", clientId: "client-5", contractId: "con-th-1", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "질병통원비 (실손)", coverageAmount: "30만", remarks: "-" },
  { id: "cov-th-27", clientId: "client-5", contractId: "con-th-1", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "상해입원비 (실손)", coverageAmount: "5,000만", remarks: "-" },
  { id: "cov-th-28", clientId: "client-5", contractId: "con-th-1", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "상해통원비 (실손)", coverageAmount: "30만", remarks: "-" },
  { id: "cov-th-29", clientId: "client-5", contractId: "con-th-1", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "비급여(도수치료) 특약", coverageAmount: "350만", remarks: "-" },
  { id: "cov-th-30", clientId: "client-5", contractId: "con-th-1", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "비급여(주사료) 특약", coverageAmount: "250만", remarks: "-" },
  { id: "cov-th-31", clientId: "client-5", contractId: "con-th-1", largeCategory: "실손", mediumCategory: "급여/비급여", smallCategory: "비급여(MRI) 특약", coverageAmount: "300만", remarks: "-" }
];

// Initialize localStorage if empty or force update for new datasets
function initializeDemoData() {
  const clientsRaw = localStorage.getItem("insu_clients");
  let needReset = false;
  if (clientsRaw) {
    try {
      const parsed = JSON.parse(clientsRaw);
      // If the first client does not have color field, we force reset to load new clean color/sortOrder/coverage values!
      if (parsed.length > 0 && !parsed[0].color) {
        needReset = true;
      }
    } catch(e) {
      needReset = true;
    }
  } else {
    needReset = true;
  }

  if (needReset) {
    localStorage.setItem("insu_clients", JSON.stringify(DEFAULT_CLIENTS));
    localStorage.setItem("insu_contracts", JSON.stringify(DEFAULT_CONTRACTS));
    localStorage.setItem("insu_coverages", JSON.stringify(DEFAULT_COVERAGES));
  }
  
  if (!localStorage.getItem("insu_admin_password")) {
    localStorage.setItem("insu_admin_password", "5675");
  }
}

initializeDemoData();
