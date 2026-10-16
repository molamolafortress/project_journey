import { Language } from '../types/game';

export interface RealisticItemSeed {
  text: string;
  category: string;
  cost: number;
  daysSpent: number;
  lifespanDelta: number;
  costBreakdown?: string;
  rationale?: string;
  story: string;
  chronicle: string;
}

export const REALISTIC_SEEDS: RealisticItemSeed[] = [
  // 1. 관계와 사랑
  {
    text: "고마웠던 사람 20명을 초대해 직접 요리한 음식으로 홈파티 열기",
    category: "관계와 사랑",
    cost: 1500,
    daysSpent: 3,
    lifespanDelta: 1.4,
    costBreakdown: "최상급 식재료 $750 + 와인 및 음료 $450 + 테이블웨어 및 공간 연출 $300 = 총 $1,500",
    rationale: "20명의 소중한 지인을 초대해 정성스러운 만찬을 대접하기 위한 현실적인 식재료 및 준비 비용입니다.",
    story: "이틀 동안 시장을 돌며 가장 신선한 식재료와 와인을 고르고, 초대할 스무 명의 얼굴을 떠올리며 메뉴를 정성껏 준비했습니다.\n\n세 번째 날 저녁, 따뜻한 조명 아래 모인 사람들의 웃음소리와 잔 부딪히는 소리가 거실을 가득 채웠습니다. 거창한 부가 아니라 진심 어린 식탁 하나만으로도 인생이 이토록 눈부시게 충만할 수 있음을 깨달았습니다.",
    chronicle: "단 3일의 준비와 $1,500의 정성으로 스무 명의 소중한 인연에게 평생 잊지 못할 밤을 선물했습니다.\n함께 나눈 온기와 웃음소리가 당신의 마음에 다시 없을 가장 뜨거운 생명력을 불어넣었습니다."
  },
  {
    text: "오해로 멀어졌던 소중한 친구에게 먼저 연락해 진심으로 화해하기",
    category: "관계와 사랑",
    cost: 300,
    daysSpent: 2,
    lifespanDelta: 1.6,
    costBreakdown: "조용한 식당에서의 저녁 식사 $180 + 마음을 담은 작은 선물과 꽃 $120 = 총 $300",
    rationale: "오랜 오해를 풀고 진심을 전하는 데는 큰 비용이 들지 않습니다. 따뜻한 식사 한 끼와 작은 선물을 위한 현실적 예산입니다.",
    story: "휴대폰 화면을 한참 멍하니 바라보다 먼저 짧은 안부 문자를 보냈습니다. 다음 날 조용한 식당에서 마주 앉았을 때, 어색한 침묵 끝에 건넨 사과 한마디에 수년간 굳어 있던 응어리가 눈 녹듯 사라졌습니다.\n\n단 이틀의 용기와 저녁 식사 한 끼로, 가슴 한구석을 짓누르던 오랜 후회의 짐을 마침내 내려놓았습니다.",
    chronicle: "수년간 가슴을 무겁게 짓누르던 침묵의 벽을 허무는 데는 많은 돈도 긴 세월도 필요치 않았습니다.\n용기 내어 건넨 진심 어린 사과가 당신의 마음에 가장 맑고 가벼운 평온을 찾아주었습니다."
  },
  {
    text: "부모님의 젊은 시절 이야기를 인터뷰해 가족 다큐멘터리 영상 남기기",
    category: "관계와 사랑",
    cost: 2000,
    daysSpent: 15,
    lifespanDelta: 1.8,
    costBreakdown: "촬영/녹음 장비 대여 $600 + 옛 사진 복원 및 편집/색보정 작업 $900 + 가족 상영회 식사 $500 = 총 $2,000",
    rationale: "보름간 부모님의 생애를 인터뷰하고 고화질 다큐멘터리와 앨범으로 남기기 위한 장비 대여 및 제작 실비입니다.",
    story: "카메라와 마이크를 챙겨 보름 동안 부모님과 마주 앉았습니다. 빛바랜 흑백 앨범을 넘기며 그동안 미처 몰랐던 어머니의 수줍던 꿈과 아버지의 치열했던 청춘의 눈물을 기록했습니다.\n\n완성된 영상을 온 가족이 모여 함께 시청하던 밤, 화면 위로 번진 눈물과 미소 속에서 깊은 사랑의 유산을 확인했습니다.",
    chronicle: "보름간 부모님의 주름진 손과 목소리를 기록하며 가족의 역사를 한 편의 영상으로 빚어냈습니다.\n세대를 이어 전해질 사랑의 기억들이 당신의 마지막 시간을 든든하게 받쳐주었습니다."
  },
  {
    text: "사랑하는 사람들과 바닷가 통나무집을 빌려 한 달간 함께 지내기",
    category: "관계와 사랑",
    cost: 11000,
    daysSpent: 30,
    lifespanDelta: 2.2,
    costBreakdown: "해변 독채 통나무집 30일 장기 렌트 $6,500 + 한 달간 가족/지인 식비 및 바비큐 $3,500 + 이동 경비 $1,000 = 총 $11,000",
    rationale: "바닷가 대형 독채 숙소를 한 달간 빌려 사랑하는 이들과 머물기 위한 현실적인 숙박 및 체류 비용입니다.",
    story: "파도 소리가 창문으로 스며드는 해변 통나무집을 한 달간 빌려 가장 소중한 이들을 초대했습니다. 시계를 벗어두고 함께 아침을 짓고, 붉게 물드는 노을을 바라보며 밤마다 모닥불 곁에서 속 깊은 이야기를 나누었습니다.\n\n어떤 특별한 계획 없이 그저 함께 숨 쉬었던 30일의 시간은 삶이 건넨 가장 다정한 선물이었습니다.",
    chronicle: "30일간 파도 소리가 머무는 집에서 소중한 사람들과 온전한 하루하루를 나누었습니다.\n함께 마주한 서른 번의 일몰이 당신의 시간을 그 어떤 치료약보다 길고 깊게 연장시켰습니다."
  },

  // 2. 창작과 예술
  {
    text: "내 인생 이야기를 담은 독립출판 에세이집 출간하기",
    category: "창작과 예술",
    cost: 4500,
    daysSpent: 45,
    lifespanDelta: 1.8,
    costBreakdown: "교정/교열 및 내지 편집 디자인 $1,500 + 표지 일러스트 의뢰 $500 + 300부 양장 인쇄 및 독립서점 입고 $2,500 = 총 $4,500",
    rationale: "개인 독립출판 단행본을 완성도 높은 품질로 300부 인쇄하고 유통하는 현실적인 출판 제작 비용입니다.",
    story: "45일 동안 새벽마다 홀로 책상에 앉아 지나온 삶의 환희와 상처를 정직한 문장으로 기록했습니다. 교정과 편집을 거쳐 표지 질감을 고르고 소량 인쇄를 마쳤습니다.\n\n갓 나온 책의 따뜻한 잉크 냄새를 맡으며 두 손으로 표지를 쓰다듬었을 때, 내가 걸어온 삶이 비로소 지워지지 않는 하나의 온전한 이야기로 완성되었습니다.",
    chronicle: "45일간의 고독한 사색과 집필 끝에 당신만의 진실을 담은 한 권의 책을 세상에 남겼습니다.\n종이 위에 새겨진 당신의 발자취는 세월이 흘러도 바래지 않을 영원한 증명이 되었습니다."
  },
  {
    text: "작곡과 기타를 배워 나만의 어쿠스틱 자작곡 음원 내기",
    category: "창작과 예술",
    cost: 3200,
    daysSpent: 30,
    lifespanDelta: 1.5,
    costBreakdown: "1:1 싱어송라이터 레슨 및 편곡 코칭 $1,200 + 전문 녹음 스튜디오 대관 및 믹싱/마스터링 $1,500 + 음원 유통 및 앨범 아트 $500 = 총 $3,200",
    rationale: "한 달간 자작곡을 다듬고 전문 스튜디오에서 녹음·마스터링하여 정식 음원으로 발매하는 표준 인디 음원 제작비입니다.",
    story: "손가락 끝에 단단한 굳은살이 박이도록 통기타 코드를 연습하고, 내면의 감정을 멜로디와 노랫말로 다듬었습니다. 조용한 스튜디오를 빌려 서툴지만 온 마음을 담아 직접 노래를 녹음했습니다.\n\n완성된 음원을 이어폰으로 처음 듣던 밤, 잊고 지냈던 유년의 순수한 열정이 가슴속에서 다시 타올랐습니다.",
    chronicle: "30일간 악보 위에 당신만의 선율을 얹어 세상에 단 하나뿐인 노래를 띄워 보냈습니다.\n방 안을 울린 작은 어쿠스틱 화음은 죽음의 그림자를 걷어내는 가장 투명한 빛이 되었습니다."
  },
  {
    text: "목공방을 빌려 내 손으로 직접 원목 식탁과 의자 만들기",
    category: "창작과 예술",
    cost: 2500,
    daysSpent: 14,
    lifespanDelta: 1.3,
    costBreakdown: "최상급 월넛(호두나무) 원목 자재비 $1,400 + 목공방 2주 공유 작업실 및 전문가 지도 $800 + 천연 오일 및 마감재 $300 = 총 $2,500",
    rationale: "원목 가구 공방에서 고급 하드우드 자재를 사용해 직접 6인용 식탁 세트를 제작하는 현실적 자재 및 공방 대여료입니다.",
    story: "2주 동안 톱밥 먼지가 날리는 공방에서 묵직한 호두나무 원목을 다듬었습니다. 대패질을 하고 사포질을 거듭할수록 머릿속을 맴돌던 불안과 잡념이 나무껍질처럼 떨어져 나갔습니다.\n\n천연 오일을 발라 은은한 결이 살아난 식탁을 마주했을 때, 손끝으로 만져지는 무언가를 빚어냈다는 묵직한 성취감이 차올랐습니다.",
    chronicle: "14일 동안 땀 흘려 나무의 결을 어루만지며 평생 쓸 원목 식탁과 의자를 완성했습니다.\n물질의 촉감에 온전히 몰입했던 그 고요한 시간이 당신의 내면을 단단하게 매만졌습니다."
  },
  {
    text: "그동안 찍은 사진들로 작은 갤러리를 대관해 개인 사진전 열기",
    category: "창작과 예술",
    cost: 5500,
    daysSpent: 10,
    lifespanDelta: 1.4,
    costBreakdown: "소규모 갤러리 10일 대관료 $2,500 + 대형 파인아트 인화 및 원목 액자 25점 제작 $2,200 + 엽서/도록 및 다과 $800 = 총 $5,500",
    rationale: "열흘간 아담한 갤러리를 대관하고 작품 25점을 파인아트 액자로 제작해 개인전을 여는 현실적인 전시 비용입니다.",
    story: "외장하드 속에 잠들어 있던 수만 장의 사진 중 내가 사랑했던 찰나의 순간들을 골라 대형 인화 액자로 제작했습니다. 골목길의 아담한 갤러리를 열흘간 빌려 조명을 직접 맞추었습니다.\n\n내가 바라보았던 세계의 온도를 관람객들이 조용히 들여다보던 그 순간, 나의 시선이 누군가의 마음에 가닿았음을 느꼈습니다.",
    chronicle: "열흘간 하얀 전시관 벽면을 당신이 사랑했던 세상의 모든 시선들로 가득 채웠습니다.\n당신이 머물렀던 빛과 풍경들은 찾아온 이들의 가슴속에 깊은 영감으로 남았습니다."
  },

  // 3. 라이프스타일 & 휴식
  {
    text: "나만의 작은 심야 책방이나 북카페를 열어 사람들과 책 이야기 나누기",
    category: "라이프스타일",
    cost: 32000,
    daysSpent: 60,
    lifespanDelta: 2.3,
    costBreakdown: "소규모 골목 상가 단기 임차/보증금 $10,000 + 원목 서가 및 조명 인테리어 $12,000 + 큐레이션 도서 매입 및 커피 설비 $10,000 = 총 $32,000",
    rationale: "동네 골목의 작은 공간을 두 달간 단장하여 심야 책방 겸 북카페로 운영하기 위한 현실적인 창업/공간 조성 비용입니다.",
    story: "골목 안 오래된 1층 공간을 임대해 나무 책장과 따뜻한 스탠드 조명을 채우고, 내가 아끼던 책들을 서가에 꽂았습니다. 두 달간 밤마다 불을 켜두고 찾아온 사람들에게 차를 내어주며 좋아하는 문장에 대해 이야기를 나누었습니다.\n\n내 취향과 온기가 깃든 공간의 주인이 되어 보낸 밤들은 내 생애 가장 평화로운 계절이었습니다.",
    chronicle: "충분한 예산과 60일의 정성을 들여 당신만의 철학이 숨 쉬는 작은 심야 책방을 열었습니다.\n그곳에서 오고 간 따뜻한 문장과 위로의 대화들이 당신의 시간을 눈부시게 확장시켰습니다."
  },
  {
    text: "마당 있는 시골집을 개조해 계절마다 꽃과 채소 가꾸며 살기",
    category: "라이프스타일",
    cost: 38000,
    daysSpent: 60,
    lifespanDelta: 2.4,
    costBreakdown: "시골 마당 있는 농가 주택 임차 $12,000 + 지붕/마루/단열 리모델링 $18,000 + 정원 조경, 묘목 및 텃밭 조성 $8,000 = 총 $38,000",
    rationale: "시골의 낡은 주택을 쾌적하게 개조하고 마당에 사계절 정원과 텃밭을 일구기 위한 현실적인 리모델링 및 체류 비용입니다.",
    story: "바람이 맑은 시골 마을의 오래된 집을 구해 지붕과 마루를 수리하고 마당에 텃밭을 일구었습니다. 두 달 동안 흙을 만지며 씨앗을 심고, 아침마다 풀잎에 맺힌 이슬을 들여다보며 자연의 시계에 맞춰 호흡했습니다.\n\n정원에 첫 꽃망울이 터지던 날, 삶과 계절의 순환 속에서 죽음마저 자연스러운 일부로 받아들여졌습니다.",
    chronicle: "흙과 햇살 속에서 두 달간 정성껏 텃밭과 꽃밭을 일구며 생명의 리듬을 체화했습니다.\n자연과 함께 숨 쉬며 얻은 깊은 평온이 6개월의 시계를 거스르는 생명력의 샘이 되었습니다."
  },
  {
    text: "도심을 떠나 조용한 숲속 오두막에서 한 달간 디지털 디톡스 하기",
    category: "라이프스타일",
    cost: 3500,
    daysSpent: 30,
    lifespanDelta: 1.7,
    costBreakdown: "깊은 숲속 독채 오두막 30일 렌트 $2,200 + 유기농 식재료 및 다도 용품, 도서 구입 $1,000 + 교통비 $300 = 총 $3,500",
    rationale: "한 달간 산림 치유 오두막을 빌려 외부와 단절된 채 자연 속에서 휴식하는 데 필요한 현실적인 숙박 및 생활비입니다.",
    story: "스마트폰을 금고에 넣어두고 깊은 침엽수림 속 작은 통나무 오두막으로 향했습니다. 한 달 동안 시계 대신 햇살의 기울기로 시간을 가늠하고, 바람 소리와 새소리를 벗 삼아 차를 마시고 글을 읽었습니다.\n\n세상의 끊임없는 알림과 비교에서 벗어나자, 비로소 내면의 가장 고요한 목소리가 들려오기 시작했습니다.",
    chronicle: "세상의 소음을 차단하고 30일간 숲의 고요한 호흡에 당신의 영혼을 맡겼습니다.\n외부의 시선을 지워버린 자리에서 길어 올린 내면의 평화가 지친 심신을 맑게 씻어냈습니다."
  },
  {
    text: "미슐랭 3스타 레스토랑에서 온전히 나만을 위한 최고의 만찬 즐기기",
    category: "라이프스타일",
    cost: 1200,
    daysSpent: 1,
    lifespanDelta: 0.6,
    costBreakdown: "미슐랭 3스타 하이엔드 디너 테이스팅 코스 $450 + 시그니처 빈티지 와인 페어링 $350 + 맞춤 정장/의상 대여 및 프라이빗 의전 $400 = 총 $1,200",
    rationale: "최고급 파인다이닝 풀코스와 소믈리에 와인 페어링, 품격 있는 의전을 통해 나 자신을 극진히 대접하는 1일 실비입니다.",
    story: "늘 가격표를 먼저 보며 망설이던 습관을 내려놓고, 가장 단정한 옷을 입고 최고급 레스토랑의 창가 자리에 앉았습니다. 예술품 같은 코스 요리와 소믈리에의 와인을 오롯이 음미하며 나 자신을 극진히 대접했습니다.\n\n단 하루의 식사였지만, 온전히 나를 아끼고 존중하는 태도가 무엇인지 몸소 깨달은 밤이었습니다.",
    chronicle: "단 하루, 온전히 당신 자신을 가장 귀한 손님으로 대접하는 황홀한 만찬을 즐겼습니다.\n스스로에게 건넨 아낌없는 존중과 미소가 남은 날들에 우아한 활기를 더했습니다."
  },

  // 4. 기여와 나눔
  {
    text: "형편이 어려운 예술가 지망생들을 위해 내 이름으로 작은 장학금 만들기",
    category: "기여와 나눔",
    cost: 30000,
    daysSpent: 14,
    lifespanDelta: 2.1,
    costBreakdown: "청년 예술가 6인을 위한 직접 창작 장학 기금 $27,000 + 장학 증서 수여식 및 법무/행정 절차 비용 $3,000 = 총 $30,000",
    rationale: "형편이 어려운 신진 예술가 6명에게 각각 $4,500의 실질적 창작 지원금을 수여하고 기금을 운영하는 현실적 출연 예산입니다.",
    story: "현실의 벽 앞에 물감을 내려놓으려던 청년 예술가들을 찾아가 당신의 이름으로 된 $30,000의 창작 기금을 전했습니다. 2주간 규정을 다듬고 장학생들의 떨리는 손과 반짝이는 눈동자를 마주했습니다.\n\n비록 나의 물리적 시간은 유한할지라도, 나의 숨결과 의지가 그들의 캔버스 위에서 끝없이 살아 숨 쉴 것임을 확신했습니다.",
    chronicle: "$30,000의 기금을 쾌척하여 젊은 예술가들의 꿈을 지탱하는 장학 기금을 세웠습니다.\n당신이 세상에 심어둔 가능성의 씨앗은 당신의 시간을 넘어 영원히 꽃피울 것입니다."
  },
  {
    text: "유기견 보호소에서 봉사하며 아픈 아이들의 치료비 후원하기",
    category: "기여와 나눔",
    cost: 8500,
    daysSpent: 20,
    lifespanDelta: 1.8,
    costBreakdown: "중증 유기견 외과 수술 및 입원 치료비 지원 $6,000 + 보호소 겨울철 난방 설비 및 사료/담요 기부 $2,000 + 20일 봉사 체류비 $500 = 총 $8,500",
    rationale: "사설 유기동물 보호소의 아픈 동물 수술비와 겨울철 필수 물품을 실질적으로 책임지는 후원 및 봉사 예산입니다.",
    story: "20일간 땀을 흘리며 보호소 견사를 청소하고 유기견들을 산책시켰습니다. 그리고 수술이 시급했던 아이들을 위해 $8,500의 치료비를 후원하여 새 삶을 찾아주었습니다.\n\n건강을 되찾은 강아지가 꼬리를 흔들며 품에 안기던 순간, 생명을 구했다는 순수한 감동이 가슴속 깊은 응어리를 녹였습니다.",
    chronicle: "20일간의 헌신과 정성으로 상처 입은 생명들에게 따뜻한 내일을 선물했습니다.\n대가 없는 순수한 사랑을 나눈 기억은 당신의 남은 생애를 가장 숭고하게 밝혔습니다."
  },
  {
    text: "내가 가진 직무 지식과 인생 노하우를 정리해 무료 온라인 강의 남기기",
    category: "기여와 나눔",
    cost: 1600,
    daysSpent: 21,
    lifespanDelta: 1.3,
    costBreakdown: "조명/핀마이크 및 촬영 스튜디오 대여 $700 + 영상 자막/편집 보조 및 교안 디자인 제작 $900 = 총 $1,600",
    rationale: "3주간 고화질 온라인 강의 시리즈와 PDF 가이드북을 제작하여 무료 공개하기 위한 스튜디오 및 편집 실비입니다.",
    story: "3주 동안 장비를 준비해 평생 부딪히며 체득한 전문 노하우와 시행착오를 담은 강의를 녹화하고 무료로 배포했습니다.\n\n수많은 후배와 청년들이 남긴 진심 어린 감사 댓글을 읽으며, 내가 치열하게 보낸 지난 세월이 헛되지 않은 든든한 징검다리가 되었음을 확인했습니다.",
    chronicle: "21일간 당신의 경험과 지혜를 아낌없이 정리하여 세상에 무료로 건넸습니다.\n누군가의 길잡이가 되어준 지식의 유산은 당신의 존재를 더욱 가치 있게 만들었습니다."
  },

  // 5. 자기완성과 배움
  {
    text: "어릴 적 꿈이었던 피아노 재즈 연주곡 한 곡 완벽하게 마스터하기",
    category: "자기완성과 배움",
    cost: 1400,
    daysSpent: 30,
    lifespanDelta: 1.2,
    costBreakdown: "재즈 피아니스트 1:1 집중 레슨 12회 $900 + 그랜드 피아노 연습실 한 달 대여 $500 = 총 $1,400",
    rationale: "한 달간 전문 강사의 밀착 레슨을 받고 매일 그랜드 피아노 연습실을 대여해 한 곡을 마스터하는 현실적 비용입니다.",
    story: "한 달 동안 매일 저녁 피아노 학원의 작은 연습실에서 건반을 눌렀습니다. 굳어 있던 손가락이 점차 부드러워지며, 마침내 악보를 보지 않고도 눈을 감은 채 재즈 곡 한 편을 유려하게 연주해 냈습니다.\n\n건반 위로 울려 퍼지는 선율 속에서, 어릴 적 음악을 꿈꾸던 순수한 소년/소녀의 나와 다시 손을 맞잡았습니다.",
    chronicle: "오래전 덮어두었던 피아노 건반 위에서 마침내 꿈꾸던 한 곡을 완성했습니다.\n어릴 적 자신과 나누었던 약속을 지켜낸 뿌듯함이 영혼에 잔잔한 기쁨을 주었습니다."
  },
  {
    text: "1년 동안 꾸준히 수련해 마라톤 풀코스(42.195km) 완주하기",
    category: "자기완성과 배움",
    cost: 1800,
    daysSpent: 60,
    lifespanDelta: 2.0,
    costBreakdown: "전문 러닝 코치 및 스포츠 재활 관리 $1,100 + 카본 러닝화 및 심박 측정 기어 $500 + 대회 참가 및 원정비 $200 = 총 $1,800",
    rationale: "체계적인 러닝 코칭과 스포츠 의학 관리를 받으며 부상 없이 마라톤 풀코스를 완주하기 위한 60일 훈련 예산입니다.",
    story: "두 달 동안 매일 새벽 러닝화를 신고 한계를 조금씩 밀어 올렸습니다. 대회 당일 35km의 사점을 넘어 마침내 결승선을 통과했을 때, 두 다리는 떨렸지만 심장은 그 어느 때보다 힘차게 고동쳤습니다.\n\n내 몸의 모든 세포가 살아 숨 쉬고 있음을 증명한 그 순간, 죽음에 대한 두려움은 완전히 사라졌습니다.",
    chronicle: "60일간의 땀과 훈련 끝에 42.195km의 한계를 극복하고 결승선을 밟았습니다.\n자신의 한계에 맞서 쟁취한 완주의 전율은 당신의 생명력을 한층 굳건하게 만들었습니다."
  },
  {
    text: "소믈리에 과정을 배우고 나만의 와인 테이스팅 노트 100편 완성하기",
    category: "자기완성과 배움",
    cost: 2800,
    daysSpent: 30,
    lifespanDelta: 1.1,
    costBreakdown: "와인 아카데미 소믈리에 집중 과정 수강료 $1,500 + 산지별 시음용 와인 30종 및 전용 글라스/가죽 노트 $1,300 = 총 $2,800",
    rationale: "전문 와인 교육 기관 수강료와 100편의 테이스팅 노트를 작성하기 위한 다양한 시음 와인 구매 실비입니다.",
    story: "한 달간 와인의 역사와 품종을 공부하며 잔에 담긴 토양과 햇살의 풍미를 섬세하게 기록했습니다. 100번째 노트를 마쳤을 때, 작은 잔 하나에도 자연과 세월이 빚어낸 경이로움이 깃들어 있음을 감각으로 배웠습니다.\n\n감각을 예민하게 깨우고 음미하는 태도는 매 순간의 일상을 보석처럼 빛나게 했습니다.",
    chronicle: "30일간 와인의 향과 세월을 탐구하며 감각의 지평을 활짝 열어젖혔습니다.\n순간의 미세한 아름다움을 음미하는 법을 배운 당신의 시간은 더욱 짙은 향기로 물들었습니다."
  },

  // 6. 모험과 자연
  {
    text: "아이슬란드 오로라 아래에서 캠핑카로 열흘간 별 보며 잠들기",
    category: "모험과 자연",
    cost: 8500,
    daysSpent: 10,
    lifespanDelta: 1.7,
    costBreakdown: "레이캬비크 왕복 항공권 $1,800 + 4륜구동 난방 캠핑카 10일 렌트 및 보험 $4,200 + 현지 연료비/온천/식비 $2,500 = 총 $8,500",
    rationale: "물가가 높은 아이슬란드에서 겨울철 방한 캠핑카를 대여해 열흘간 일주하는 실제 항공 및 현지 체류 비용입니다.",
    story: "소형 캠핑카를 몰고 얼음과 화산의 대지를 달렸습니다. 칠흑 같은 밤하늘에 거대한 초록빛 오로라가 파도처럼 일렁이던 순간, 차를 멈추고 영하의 공기 속에서 숨을 죽였습니다.\n\n광활한 대자연의 장엄함 앞에서 인간의 작은 불안과 시련은 티끌처럼 흩어지고 경이로운 평화만이 남았습니다.",
    chronicle: "열흘간 지구의 북쪽 끝에서 밤하늘을 수놓은 오로라의 춤을 가만히 올려다보았습니다.\n우주의 압도적인 숭고함 앞에서 죽음에 대한 공포는 평화로운 찬탄으로 승화되었습니다."
  },
  {
    text: "스페인 산티아고 순례길 800km를 걸으며 온전히 나에게 집중하기",
    category: "모험과 자연",
    cost: 5200,
    daysSpent: 35,
    lifespanDelta: 2.1,
    costBreakdown: "유럽 왕복 항공권 및 현지 열차 $1,600 + 35일간 알베르게/펜션 숙박 및 순례자 식사 $2,800 + 전문 트레킹 장비 $800 = 총 $5,200",
    rationale: "프랑스 생장피드포르에서 산티아고까지 800km를 35일간 완주하는 데 필요한 항공권, 숙박, 식비, 장비 표준 예산입니다.",
    story: "배낭 하나를 짊어지고 35일간 밀밭과 숲길을 매일 걸었습니다. 발바닥에 물집이 잡히고 근육이 비명을 질렀지만, 단순한 걸음의 반복 속에서 마음속 불필요한 욕심과 타인의 시선들이 말끔히 떨어져 나갔습니다.\n\n대성당 앞 광장에 배낭을 내려놓았을 때, 세상에서 가장 가볍고 자유로운 나를 만났습니다.",
    chronicle: "35일 동안 800km의 길을 걸으며 일생에서 가장 진실한 나와의 대화를 나눴습니다.\n길 위에 흘린 땀방울마다 불필요한 번뇌를 털어내고 가장 순수한 생명력을 채웠습니다."
  }
];

export const REALISTIC_SEEDS_EN: RealisticItemSeed[] = [
  // 1. Relationships & Love
  {
    text: "Host a warm home-cooked dinner party for the 20 people I'm most grateful for",
    category: "Relationships & Love",
    cost: 1500,
    daysSpent: 3,
    lifespanDelta: 1.4,
    costBreakdown: "Artisanal fresh ingredients $750 + Fine wines & beverages $450 + Tableware & warm lighting decor $300 = Total $1,500",
    rationale: "Realistic market budget for sourcing premium ingredients, wine, and table settings to host a heartfelt dinner for 20 cherished guests.",
    story: "For two days, I wandered through local markets selecting the freshest ingredients and wines, crafting each dish while picturing the faces of twenty people who made my life brighter.\n\nOn the third evening, warm light, laughter, and the clinking of glasses filled the room. I realized it takes neither vast wealth nor decades—only a sincere table shared with loved ones—to make a life feel breathtakingly complete.",
    chronicle: "With just 3 days of preparation and $1,500, you gifted twenty cherished souls an unforgettable night.\nThe warmth and laughter shared around that table breathed a fierce, radiant vitality back into your heart."
  },
  {
    text: "Reach out first and sincerely reconcile with an old friend lost to misunderstanding",
    category: "Relationships & Love",
    cost: 300,
    daysSpent: 2,
    lifespanDelta: 1.6,
    costBreakdown: "Quiet dinner for two $180 + Thoughtful gift & flowers $120 = Total $300",
    rationale: "Mending an old bond requires courage rather than wealth. Covers a quiet dinner and a heartfelt token of reconciliation.",
    story: "After staring at my phone screen for a long while, I finally sent a short message. When we sat across from each other the next evening, one honest apology after an awkward silence melted away years of hardened pride.\n\nWith just two days of courage and a single dinner, the heavy regret I had carried in the corner of my heart was finally set down.",
    chronicle: "Tearing down a wall of silence built over years required neither fortune nor long seasons.\nA single courageous apology restored the clearest, lightest peace to your spirit."
  },
  {
    text: "Interview my parents about their youth and film a family documentary",
    category: "Relationships & Love",
    cost: 2000,
    daysSpent: 15,
    lifespanDelta: 1.8,
    costBreakdown: "Camera & audio rental $600 + Vintage photo restoration & editing $900 + Family screening dinner $500 = Total $2,000",
    rationale: "Covers 15 days of filming equipment rental, archival photo restoration, editing, and a private family screening.",
    story: "With a camera and microphone set up, I spent fifteen days sitting face-to-face with my parents. Turning the pages of faded black-and-white albums, I recorded my mother's shy youthful dreams and my father's quiet tears for the first time.\n\nOn the night our family gathered to watch the finished film, the tears and smiles reflected on the screen confirmed an enduring legacy of love.",
    chronicle: "Over fifteen days, you captured your parents' weathered hands and voices, weaving your family's history into a living film.\nThose memories of love, preserved for generations to come, held up your remaining time with quiet strength."
  },
  {
    text: "Rent a seaside cabin for a month and live quietly with the people I love",
    category: "Relationships & Love",
    cost: 11000,
    daysSpent: 30,
    lifespanDelta: 2.2,
    costBreakdown: "30-day oceanfront cabin rental $6,500 + Shared meals & groceries for a month $3,500 + Travel $1,000 = Total $11,000",
    rationale: "Realistic 30-day coastal lodge rental and living expenses to host family and close friends by the sea.",
    story: "I rented a wooden cabin where the sound of waves drifted through the windows and invited the people dearest to me. Setting aside our watches, we cooked breakfast together, watched crimson sunsets, and talked late into the night beside a crackling fire.\n\nThirty days of simply breathing side by side, without grand plans, became the gentlest gift life could offer.",
    chronicle: "For 30 days in a house filled with the sound of the sea, you shared whole, unhurried days with those you love.\nThirty sunsets witnessed together extended your time more deeply than any medicine ever could."
  },

  // 2. Creativity & Art
  {
    text: "Write and self-publish an indie essay book telling the story of my life",
    category: "Creativity & Art",
    cost: 4500,
    daysSpent: 45,
    lifespanDelta: 1.8,
    costBreakdown: "Professional editing & typesetting $1,500 + Cover illustration $500 + 300 hardcover prints & indie bookstore distribution $2,500 = Total $4,500",
    rationale: "Standard independent publishing cost for editing, cover design, and printing 300 high-quality hardcover copies.",
    story: "For 45 dawns, I sat alone at my desk translating the joys and scars of my life into honest sentences. After careful editing and choosing the paper grain for the cover, the small print run was finally complete.\n\nBreathing in the warm scent of fresh ink and holding the finished book in both hands, I felt my life had become an indelible story.",
    chronicle: "After 45 days of solitary reflection and writing, you left behind a book holding your deepest truths.\nThe footprints etched onto those pages became an enduring testament that time cannot fade."
  },
  {
    text: "Learn guitar and songwriting to record and release my own acoustic single",
    category: "Creativity & Art",
    cost: 3200,
    daysSpent: 30,
    lifespanDelta: 1.5,
    costBreakdown: "1-on-1 songwriting & guitar coaching $1,200 + Studio recording, mixing & mastering $1,500 + Digital release & artwork $500 = Total $3,200",
    rationale: "Realistic indie music production budget covering a month of coaching, professional studio recording, and mastering.",
    story: "I practiced acoustic chords until calluses formed on my fingertips, shaping my unspoken feelings into melody and lyrics. In a quiet recording booth, I sang my own song with an imperfect but wholehearted voice.\n\nListening to the mastered track through earphones that night, the pure passion of my youth blazed bright once more.",
    chronicle: "Over 30 days, you placed your own melody onto the staff and sent a one-of-a-kind song into the world.\nThose gentle acoustic chords became the clearest light chasing away the shadow of fear."
  },
  {
    text: "Rent a woodworking bench and craft a solid walnut dining table with my own hands",
    category: "Creativity & Art",
    cost: 2500,
    daysSpent: 14,
    lifespanDelta: 1.3,
    costBreakdown: "Solid walnut hardwood lumber $1,400 + 2-week workshop rental & master guidance $800 + Natural oil finishes $300 = Total $2,500",
    rationale: "Covers premium walnut timber, two weeks of studio access, and artisan mentorship.",
    story: "For two weeks in a sawdust-filled workshop, I planed and sanded heavy slabs of walnut. With every pass of the hand plane, anxious thoughts peeled away like wood shavings.\n\nWhen I rubbed natural oil into the grain and stood before the finished table, a grounded pride filled my chest—I had built something real and lasting.",
    chronicle: "For 14 days, you poured your sweat into shaping solid wood into a table built to last generations.\nImmersion in the honest texture of timber steadied and quieted your inner world."
  },
  {
    text: "Rent a small neighborhood gallery and hold a personal photo exhibition",
    category: "Creativity & Art",
    cost: 5500,
    daysSpent: 10,
    lifespanDelta: 1.4,
    costBreakdown: "10-day boutique gallery rental $2,500 + 25 fine-art framed prints $2,200 + Booklets & reception $800 = Total $5,500",
    rationale: "Realistic budget for renting a small gallery for 10 days and framing 25 archival fine-art photographs.",
    story: "From tens of thousands of photos sleeping on old hard drives, I selected the fleeting moments I loved most and framed them in large prints. For ten days in a quiet alley gallery, I adjusted the spotlights myself.\n\nWatching visitors pause silently before the warmth of the world I had seen, I knew my gaze had reached another human heart.",
    chronicle: "For ten days, you filled white gallery walls with every tender gaze you had cast upon the world.\nThe light and landscapes you cherished lingered as quiet inspiration in the hearts of all who visited."
  },

  // 3. Lifestyle & Rest
  {
    text: "Open a tiny late-night bookstore café and talk about books with strangers",
    category: "Lifestyle",
    cost: 32000,
    daysSpent: 60,
    lifespanDelta: 2.3,
    costBreakdown: "Short-term alley shop lease & deposit $10,000 + Wooden shelves & warm lighting interior $12,000 + Curated books & coffee bar $10,000 = Total $32,000",
    rationale: "Realistic 2-month pop-up indie bookshop and café setup cost in a quiet neighborhood.",
    story: "I leased an old ground-floor space down a quiet lane, filling it with wooden shelves, warm lamps, and the books that shaped my life. For two months, I kept the lights on late into the night, pouring tea for visitors and talking about our favorite sentences.\n\nThose nights spent tending a sanctuary of my own taste and warmth became the most peaceful season of my life.",
    chronicle: "With dedicated savings and 60 days of care, you opened a late-night bookshop breathing with your philosophy.\nThe comforting sentences and quiet conversations shared there radiantly expanded your time."
  },
  {
    text: "Renovate a country house with a yard and tend seasonal flowers and vegetables",
    category: "Lifestyle",
    cost: 38000,
    daysSpent: 60,
    lifespanDelta: 2.4,
    costBreakdown: "Country house lease $12,000 + Roof, porch & insulation renovation $18,000 + Garden soil, saplings & tools $8,000 = Total $38,000",
    rationale: "Realistic cost to lease and renovate a rural home and cultivate a garden over two months.",
    story: "I found an old house in a breezy country village, repaired the porch, and turned the soil in the yard. For two months I planted seeds with bare hands, watching morning dew gather on green leaves and breathing in sync with nature's clock.\n\nOn the morning the first buds opened, even mortality felt like a gentle, natural part of the seasons.",
    chronicle: "For two months in soil and sunlight, you tended a garden and embodied the rhythm of living things.\nThe deep serenity found in breathing with nature became a wellspring of life defying the six-month clock."
  },
  {
    text: "Leave the city for a quiet forest cabin and do a 30-day digital detox",
    category: "Lifestyle",
    cost: 3500,
    daysSpent: 30,
    lifespanDelta: 1.7,
    costBreakdown: "30-day secluded forest cabin rental $2,200 + Organic food, tea & books $1,000 + Transport $300 = Total $3,500",
    rationale: "Covers a month-long stay in a secluded woodland cabin with simple, nourishing provisions.",
    story: "I locked my smartphone away and headed to a small log cabin deep in a pine forest. For a month, I measured time by the slant of sunlight rather than a clock, drinking tea and reading to the sound of wind and birdsong.\n\nFreed from endless notifications and comparisons, I finally heard the quietest voice inside me.",
    chronicle: "Shutting out the noise of the world, you entrusted your spirit to the quiet breathing of the forest for 30 days.\nThe inner peace drawn from silence washed away years of exhaustion."
  },
  {
    text: "Dine alone at a Michelin 3-star restaurant to honor and celebrate myself",
    category: "Lifestyle",
    cost: 1200,
    daysSpent: 1,
    lifespanDelta: 0.6,
    costBreakdown: "Michelin 3-star tasting menu $450 + Vintage sommelier wine pairing $350 + Tailored attire & private car service $400 = Total $1,200",
    rationale: "Full fine-dining tasting menu, vintage pairing, and private transport for a single unforgettable evening.",
    story: "Letting go of my lifelong habit of checking price tags first, I dressed in my finest clothes and took a window seat at a three-star restaurant. Savoring each course like a work of art, I treated myself as someone truly precious.\n\nThough it was only a single evening, I learned what it feels like to offer myself unconditional respect.",
    chronicle: "For one evening, you welcomed yourself as the most honored guest at an unforgettable feast.\nThat generous self-respect and quiet smile added graceful vitality to your remaining days."
  },

  // 4. Giving & Legacy
  {
    text: "Establish a small scholarship in my name for struggling young artists",
    category: "Giving & Legacy",
    cost: 30000,
    daysSpent: 14,
    lifespanDelta: 2.1,
    costBreakdown: "Direct creative grants for 6 emerging artists $27,000 + Endowment setup & ceremony $3,000 = Total $30,000",
    rationale: "Provides $4,500 fellowships to six young artists along with administrative setup.",
    story: "I sought out young artists who were about to put down their brushes before the wall of reality and gifted a $30,000 creative fund in my name. Over two weeks, I met the recipients and held their trembling hands.\n\nThough my physical time is finite, I knew with certainty that my spirit would keep breathing across their canvases.",
    chronicle: "You dedicated $30,000 to establish a scholarship sustaining the dreams of young artists.\nThe seeds of possibility you planted in the world will blossom far beyond your time."
  },
  {
    text: "Volunteer at an animal shelter and fund surgeries for injured rescue dogs",
    category: "Giving & Legacy",
    cost: 8500,
    daysSpent: 20,
    lifespanDelta: 1.8,
    costBreakdown: "Veterinary surgeries & medical care for rescue dogs $6,000 + Shelter heating, food & blankets $2,000 + 20-day stay $500 = Total $8,500",
    rationale: "Directly funds urgent veterinary surgeries and winter shelter supplies during a 20-day volunteer stay.",
    story: "For twenty days, I scrubbed kennels, walked rescue dogs, and funded $8,500 in urgent surgeries to give injured animals a second life.\n\nWhen a recovered puppy wagged its tail and buried itself in my arms, the pure joy of saving a life melted the deepest knots in my chest.",
    chronicle: "Through 20 days of devotion, you gifted a warm tomorrow to wounded lives.\nThe memory of unconditional love shared illuminated your remaining days with quiet nobility."
  },
  {
    text: "Record and release a free online course sharing my life's craft and wisdom",
    category: "Giving & Legacy",
    cost: 1600,
    daysSpent: 21,
    lifespanDelta: 1.3,
    costBreakdown: "Studio lighting & audio rental $700 + Video editing, captions & workbook design $900 = Total $1,600",
    rationale: "Covers 3 weeks of studio recording and editing to publish a free educational series.",
    story: "Over three weeks, I recorded everything I had learned through decades of trial and error and released the lectures online for free.\n\nReading heartfelt messages from young learners who found their footing through my words, I knew my years of struggle had become a sturdy stepping stone for others.",
    chronicle: "Over 21 days, you generously distilled your wisdom and offered it freely to the world.\nThat legacy of knowledge became a guiding light for others and gave deep meaning to your journey."
  },

  // 5. Mastery & Growth
  {
    text: "Master a complete jazz piano piece I dreamed of playing as a child",
    category: "Mastery & Growth",
    cost: 1400,
    daysSpent: 30,
    lifespanDelta: 1.2,
    costBreakdown: "12 private jazz piano lessons $900 + 30-day grand piano practice room pass $500 = Total $1,400",
    rationale: "Covers one month of intensive 1-on-1 jazz instruction and daily grand piano studio access.",
    story: "Every evening for a month, I practiced in a small piano room until my stiff fingers grew supple. At last, I closed my eyes and played an entire jazz piece from memory without sheet music.\n\nIn the melody resonating from the keys, I held hands once more with the child who used to dream of music.",
    chronicle: "Upon piano keys long left closed, you finally completed the song of your childhood dreams.\nKeeping that long-ago promise to yourself filled your soul with gentle joy."
  },
  {
    text: "Train steadily for two months and finish a full marathon (42.195km)",
    category: "Mastery & Growth",
    cost: 1800,
    daysSpent: 60,
    lifespanDelta: 2.0,
    costBreakdown: "Professional running coach & sports therapy $1,100 + Carbon running shoes & heart monitor $500 + Race entry & travel $200 = Total $1,800",
    rationale: "Covers 60 days of guided coaching, sports physiotherapy, and gear for marathon completion.",
    story: "For two months, I laced up my running shoes at dawn and pushed my limits mile by mile. When I broke through the wall at 35km on race day and crossed the finish line, my legs trembled but my heart beat stronger than ever.\n\nIn that moment of proving every cell in my body was alive, the fear of death vanished completely.",
    chronicle: "After 60 days of sweat and discipline, you overcame 42.195 kilometers and crossed the finish line.\nThe triumph of confronting your limits head-on forged an unshakeable vitality within you."
  },
  {
    text: "Take a sommelier course and complete 100 personal wine tasting notes",
    category: "Mastery & Growth",
    cost: 2800,
    daysSpent: 30,
    lifespanDelta: 1.1,
    costBreakdown: "Sommelier intensive course tuition $1,500 + 30 curated regional wines, glassware & leather journal $1,300 = Total $2,800",
    rationale: "Covers sommelier academy tuition and tasting samples to document 100 sensory notes.",
    story: "For a month, I studied vineyards and vintages, recording the sunlight and soil captured in every glass. Completing my hundredth note, I learned how much wonder time and nature can hold inside a single cup.\n\nAwakening my senses taught me to savor every ordinary day like a jewel.",
    chronicle: "Over 30 days of exploring aroma and vintage, you opened wide the horizons of your senses.\nLearning to savor the subtle beauty of each moment steeped your remaining time in rich fragrance."
  },

  // 6. Adventure & Nature
  {
    text: "Sleep under the Northern Lights in an Iceland campervan for ten nights",
    category: "Adventure & Nature",
    cost: 8500,
    daysSpent: 10,
    lifespanDelta: 1.7,
    costBreakdown: "Round-trip flights to Reykjavik $1,800 + 10-day 4x4 heated campervan rental $4,200 + Fuel, hot springs & food $2,500 = Total $8,500",
    rationale: "Realistic 10-day Iceland expedition budget including flights, winter campervan insurance, and local expenses.",
    story: "I drove a small campervan across a land of ice and volcanoes. When vast curtains of green aurora rippled across the pitch-black sky, I pulled over and held my breath in the freezing air.\n\nBefore the majesty of the cosmos, human anxiety scattered like dust, leaving only awe and peace.",
    chronicle: "For ten nights at the northern edge of the earth, you watched the aurora dance across the stars.\nBefore the sublime vastness of the universe, fear dissolved into peaceful wonder."
  },
  {
    text: "Walk 800km along the Camino de Santiago in Spain to focus entirely on myself",
    category: "Adventure & Nature",
    cost: 5200,
    daysSpent: 35,
    lifespanDelta: 2.1,
    costBreakdown: "Round-trip flights & train $1,600 + 35 days of albergue lodging & pilgrim meals $2,800 + Trekking gear $800 = Total $5,200",
    rationale: "Standard 35-day Camino Francés budget covering flights, daily lodging, meals, and trekking equipment.",
    story: "Shouldering a single backpack, I walked through wheat fields and forest trails for 35 days. Blisters formed and muscles ached, yet in the simple rhythm of footsteps, needless greed and others' expectations fell away.\n\nSetting my pack down in the cathedral square, I met the lightest, freest version of myself.",
    chronicle: "Walking 800 kilometers over 35 days, you held the most honest conversation of your life with yourself.\nEvery drop of sweat along the trail shed old burdens and filled you with pure vitality."
  }
];

export function getRealisticSeeds(lang: Language = 'ko'): RealisticItemSeed[] {
  return lang === 'en' ? REALISTIC_SEEDS_EN : REALISTIC_SEEDS;
}
