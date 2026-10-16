import { BucketItem, PlayerProfile, EndingSlide, RefinementSuggestion, Language } from '../types/game';
import { REALISTIC_SEEDS, REALISTIC_SEEDS_EN, getRealisticSeeds } from '../data/realisticDb';

/**
 * Checks if a user's raw bucket list input is overly vague and needs refinement.
 */
export function checkNeedsRefinement(text: string, lang: Language = 'ko'): RefinementSuggestion | null {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  if (lang === 'en') {
    const vagueKeywordsEn = ['travel', 'trip', 'exercise', 'study', 'music', 'book', 'happiness', 'rest', 'money', 'love', 'art', 'cooking', 'house', 'party'];
    const isShortEn = trimmed.split(/\s+/).length <= 1 && trimmed.length <= 10;
    const isKeywordEn = vagueKeywordsEn.includes(lower);

    if (isShortEn || isKeywordEn) {
      if (lower.includes('travel') || lower.includes('trip')) {
        return {
          question: `Shall we shape '${trimmed}' into a more vivid personal journey?`,
          options: [
            'Walk 800km along the Camino de Santiago in Spain, focusing entirely on myself',
            'Sleep under the northern lights in an Iceland campervan for ten nights',
            'Rent a quiet seaside cabin for a month with the people I love most'
          ]
        };
      }
      if (lower.includes('music') || lower.includes('song')) {
        return {
          question: `What kind of musical moment do you dream of creating with '${trimmed}'?`,
          options: [
            'Learn guitar and songwriting to record and release my own acoustic single',
            'Master a jazz piano piece I have dreamed of playing since childhood',
            'Experience my favorite artist live from the front row at a concert in London'
          ]
        };
      }
      if (lower.includes('book') || lower.includes('write')) {
        return {
          question: `What dream have you held in your heart regarding '${trimmed}'?`,
          options: [
            'Publish an independent essay collection telling the story of my life',
            'Open a tiny late-night bookstore or book cafe to share stories with people',
            'Retreat to a quiet forest cabin for a month and read all the books I love'
          ]
        };
      }
      if (lower.includes('cook') || lower.includes('food') || lower.includes('party')) {
        return {
          question: `How and with whom would you love to enjoy '${trimmed}'?`,
          options: [
            'Invite 20 cherished friends and host a warm home party with food I cooked myself',
            'Savor a once-in-a-lifetime dinner at a 3-Michelin-star restaurant just for myself',
            'Spend a month at a countryside culinary school in France learning classic patisserie'
          ]
        };
      }
      return {
        question: `What is the most meaningful vision you hold in your heart for '${trimmed}'?`,
        options: [
          `${trimmed} — Create a genuine work of my own to leave behind in the world`,
          `${trimmed} — Share deep memories and warmth with the people I cherish`,
          `${trimmed} — Step away from daily noise and immerse myself purely in what I love`
        ]
      };
    }
    return null;
  }

  const vagueKeywords = ['여행', '세계여행', '운동', '공부', '음악', '책', '행복', '휴식', '돈', '사랑', '그림', '요리', '집'];

  const isShort = trimmed.length <= 4;
  const isKeyword = vagueKeywords.includes(trimmed);

  if (isShort || isKeyword) {
    if (trimmed.includes('여행')) {
      return {
        question: `'${trimmed}'에 대해 조금 더 구체적인 컨셉을 정해볼까요?`,
        options: [
          '스페인 산티아고 순례길 800km를 걸으며 온전히 나에게 집중하기',
          '아이슬란드 오로라 아래에서 캠핑카로 열흘간 별 보며 잠들기',
          '사랑하는 사람들과 바닷가 통나무집을 빌려 한 달간 함께 지내기'
        ]
      };
    }
    if (trimmed.includes('음악') || trimmed.includes('노래')) {
      return {
        question: `'${trimmed}'을 통해 어떤 순간을 완성하고 싶으신가요?`,
        options: [
          '작곡과 기타를 배워 나만의 어쿠스틱 자작곡 음원 내기',
          '어릴 적 꿈이었던 피아노 재즈 연주곡 한 곡 완벽하게 마스터하기',
          '좋아하는 아티스트의 런던 콘서트 라이브를 1열에서 관람하기'
        ]
      };
    }
    if (trimmed.includes('책') || trimmed.includes('글')) {
      return {
        question: `'${trimmed}'과 관련해 어떤 꿈을 마음에 품고 계셨나요?`,
        options: [
          '내 인생 이야기를 담은 독립출판 에세이집 출간하기',
          '나만의 작은 심야 책방이나 북카페를 열어 사람들과 책 이야기 나누기',
          '도심을 떠나 조용한 숲속 오두막에서 한 달간 좋아하는 책 실컷 읽기'
        ]
      };
    }
    if (trimmed.includes('요리') || trimmed.includes('식사') || trimmed.includes('파티')) {
      return {
        question: `'${trimmed}'을 누구와 어떤 형태로 즐기고 싶으신가요?`,
        options: [
          '고마웠던 사람 20명을 초대해 직접 요리한 음식으로 홈파티 열기',
          '미슐랭 3스타 레스토랑에서 온전히 나만을 위한 최고의 만찬 즐기기',
          '프랑스 시골 요리 학교에서 한 달간 정통 파티세리 과정 배우기'
        ]
      };
    }
    // General fallback refinement
    return {
      question: `'${trimmed}'에 대해 마음속에 그리는 가장 이상적인 그림은 무엇인가요?`,
      options: [
        `${trimmed} - 나만의 진실한 창작물을 만들어 세상에 남기기`,
        `${trimmed} - 소중한 사람들과 함께 깊은 추억과 온기 나누기`,
        `${trimmed} - 일상의 번잡함을 벗어나 온전히 나 자신에게 몰입하기`
      ]
    };
  }

  return null;
}

/**
 * Estimates realistic cost, days, lifespan delta, and narrative for a bucket list item.
 */
export function estimateRealisticBucketItem(text: string, id: number, lang: Language = 'ko'): BucketItem {
  const trimmed = text.trim();

  // 1. Exact match from predefined realistic seeds (check both languages)
  const seeds = getRealisticSeeds(lang);
  const exact = seeds.find(s => s.text === trimmed) || REALISTIC_SEEDS.find(s => s.text === trimmed) || REALISTIC_SEEDS_EN.find(s => s.text === trimmed);
  if (exact) {
    return {
      id,
      text: exact.text,
      category: exact.category,
      cost: exact.cost,
      costBreakdown: exact.costBreakdown,
      rationale: exact.rationale,
      feasibility: 'realistic',
      daysSpent: exact.daysSpent,
      lifespanDelta: exact.lifespanDelta,
      story: exact.story,
      chronicle: exact.chronicle,
      status: 'ready',
      selected: false
    };
  }

  // 2. Keyword heuristic matching for free-form custom input
  const t = trimmed.toLowerCase();

  // Detour 1: Extreme / Military
  if (t.includes('핵') || t.includes('미사일') || t.includes('전투기') || t.includes('무기') || t.includes('잠수함') || t.includes('폭탄') || t.includes('nuke') || t.includes('missile') || t.includes('fighter jet') || t.includes('bomb')) {
    if (lang === 'en') {
      return {
        id,
        text: trimmed,
        category: 'Extraordinary Experience',
        cost: 6000,
        daysSpent: 10,
        lifespanDelta: 1.5,
        costBreakdown: 'Desert rocket launch observation tour $2,500 + Decommissioned nuclear silo bunker private tour $1,500 + Desert pyrotechnic simulation & stay $2,000 = Total $6,000',
        rationale: 'Since purchasing real strategic weapons is impossible, we realized the underlying emotional longing through an experiential detour: observing a desert rocket launch, touring a decommissioned underground missile silo, and experiencing a massive pyrotechnic shockwave to safely sublimate repressed anger and helplessness.',
        feasibility: 'realistic',
        story: `Out in the vast desert where red dust swept across the horizon, you stood before the heavy blast doors of a decommissioned Cold War missile silo deep underground. As the earth-shaking roar of a rocket ignition and simulated detonation struck your chest, the helplessness and anger locked deep inside scattered into the desert wind.\n\nYou realized the true reason you wanted to shatter the world was the helplessness of facing mortality. In the vast silence that followed the roar, you finally laid down the weight pressing on your heart and found peace.`,
        chronicle: `A heart that once longed for overwhelming destructive force found true peace in the vast silence of the desert.\nHaving burned away all repressed anger in the earth-shaking roar, you greeted your remaining days with a clear soul.`,
        status: 'ready',
        selected: false
      };
    }
    return {
      id,
      text: trimmed,
      category: '특별한 체험',
      cost: 6000,
      daysSpent: 10,
      lifespanDelta: 1.5,
      costBreakdown: '사막 로켓 발사대 참관 투어 $2,500 + 퇴역 핵사일로 지하 벙커 박물관 대관 투어 $1,500 + 사막 특수 폭발/불꽃 시뮬레이션 및 체류비 $2,000 = 총 $6,000',
      rationale: '실제 핵무기 구매는 불가능하므로, 사막의 로켓 발사대 관측 및 퇴역 지하 핵사일로 벙커 투어, 대형 폭발 시뮬레이션 프로그램을 통해 내면의 억눌렸던 파괴 충동과 허무를 안전하고 장엄하게 승화하는 우회 체험으로 실현했습니다.',
      feasibility: 'realistic',
      story: `지평선 끝까지 붉은 흙먼지가 날리는 광활한 사막 한가운데, 냉전 시절 지하 수십 미터 아래 지어졌던 거대한 퇴역 핵사일로의 철문을 마주했습니다. 지축을 뒤흔드는 대형 모의 폭발 시뮬레이션과 로켓 연소의 거대한 굉음이 가슴을 강타하는 순간, 마음속 깊은 곳에 억눌려 있던 무력감과 분노가 먼지바람과 함께 하얗게 날아갔습니다.\n\n세상을 부수고 싶었던 진짜 이유는 죽음 앞에서의 무력감 때문이었음을 깨달았습니다. 굉음이 잦아든 사막의 고요 속에서, 비로소 가슴을 무겁게 짓누르던 모든 응어리를 내려놓고 평온을 되찾았습니다.`,
      chronicle: `거대한 파괴의 힘을 동경했던 마음은 사막의 광활한 침묵 속에서 비로소 진정한 평온을 찾았습니다.\n지축을 울리는 굉음 속에서 억눌렸던 분노를 모두 태워 보내고, 당신은 가장 맑은 영혼으로 남은 날들을 맞이했습니다.`,
      status: 'ready',
      selected: false
    };
  }

  // Detour 2: Omnipotence / Godlike / Invincibility
  if (t.includes('전지전능') || t.includes('신이') || t.includes('불로불사') || t.includes('영생') || t.includes('omnipoten') || t.includes('immortal') || t.includes('become god')) {
    if (lang === 'en') {
      return {
        id,
        text: trimmed,
        category: 'Mind & Inner Peace',
        cost: 2500,
        daysSpent: 14,
        lifespanDelta: 1.8,
        costBreakdown: 'Sleep clinic biofeedback & brainwave training $1,200 + 2-week intensive lucid dreaming mastery $800 + Restorative retreat $500 = Total $2,500',
        rationale: 'To fulfill the longing to transcend physical limits and command reality, this experiential detour uses specialized sleep-clinic lucid dreaming training so you can experience complete omnipotence in your dreams every night.',
        feasibility: 'realistic',
        story: `You entered a specialized sleep clinic to train your brainwaves and awaken consciousness within your dreams. On the tenth night, when you stretched out your hand inside the dream, gravity vanished and the Milky Way unfolded beneath your feet, granting you complete freedom to shape an entire universe at will.\n\nWhen you opened your eyes in the morning, you realized that true omnipotence is not ruling the outer world, but becoming the serene master of your own mind.`,
        chronicle: `Beyond the boundary of sleep, you spent nights of omnipotence commanding the universe within your heart.\nThe inner freedom that transcended physical limits filled your remaining life with unshakable serenity.`,
        status: 'ready',
        selected: false
      };
    }
    return {
      id,
      text: trimmed,
      category: '정신과 내면',
      cost: 2500,
      daysSpent: 14,
      lifespanDelta: 1.8,
      costBreakdown: '전문 수면 클리닉 바이오피드백 및 뇌파 조절 훈련 $1,200 + 자각몽(루시드 드림) 2주 집중 마스터 세션 $800 + 숙면 리트릿 $500 = 총 $2,500',
      rationale: '현실의 육체적 한계를 넘어 마음껏 세계를 다스리고자 하는 갈망을 실현하기 위해, 수면 의학 클리닉의 자각몽(루시드 드림) 훈련을 통해 꿈속에서 모든 물리법칙을 지휘하는 전지전능을 만끽하는 우회 프로젝트입니다.',
      feasibility: 'realistic',
      story: `전문 수면 클리닉에 입소하여 뇌파를 조절하고 꿈속에서 의식을 깨우는 자각몽 훈련을 시작했습니다. 훈련 열흘째 되던 밤, 꿈속에서 손을 뻗자 중력이 사라지고 발밑으로 밤하늘의 은하수가 펼쳐지며 온 세상을 내 뜻대로 빚어내는 완전한 자유를 경험했습니다.\n\n꿈에서 깨어났을 때, 진정한 전지전능이란 세상을 지배하는 것이 아니라 내 마음의 주인이 되는 것임을 비로소 깨달았습니다.`,
      chronicle: `꿈의 경계를 넘어 마음속 우주를 온전히 다스리는 전지전능의 밤들을 보냈습니다.\n물리적 한계를 초월한 내면의 자유는 남은 생애를 흔들림 없는 평온으로 채워주었습니다.`,
      status: 'ready',
      selected: false
    };
  }

  // Detour 3: Superpower / Magic / Elsa
  if (t.includes('초능력') || t.includes('엘사') || t.includes('마법') || t.includes('빙결') || t.includes('superpower') || t.includes('elsa') || t.includes('magic')) {
    if (lang === 'en') {
      return {
        id,
        text: trimmed,
        category: 'Extraordinary Experience',
        cost: 4500,
        daysSpent: 8,
        lifespanDelta: 1.7,
        costBreakdown: 'Hokkaido Ice Hotel 3-night private booking $1,800 + Special effects studio liquid nitrogen & lighting setup $1,500 + Flights & winter gear $1,200 = Total $4,500',
        rationale: 'To honor the pure childlike wonder of wielding magic, we staged an unforgettable real-life spectacle at an ice palace with professional special-effects artists, blooming frost crystals at the wave of your fingertips.',
        feasibility: 'realistic',
        story: `Inside a snow-white ice palace at minus 15 degrees Celsius, a special-effects team set up liquid nitrogen mist and shimmering aurora lights. The moment you swept your hand through the air and crystalline ice roses bloomed amidst silver frost, you laughed out loud like a child.\n\nYou felt in your heart that the miracle you had longed for since childhood was not magic itself, but the version of you whose eyes sparkled with pure wonder.`,
        chronicle: `In a snow-white palace of ice, you summoned the magical moment of your childhood dreams into reality.\nThe crystals of wonder that bloomed at your fingertipscolored cold reality with the warm light of a fairy tale.`,
        status: 'ready',
        selected: false
      };
    }
    return {
      id,
      text: trimmed,
      category: '특별한 체험',
      cost: 4500,
      daysSpent: 8,
      lifespanDelta: 1.7,
      costBreakdown: '홋카이도 아이스 호텔 3박 대관 $1,800 + 특수효과 스튜디오 액체질소 및 드라이아이스 연출 장비 대여 $1,500 + 왕복 항공 및 방한 장비 $1,200 = 총 $4,500',
      rationale: '환상 속 마법과 초능력을 경험하고 싶은 순수한 동심을 위해, 혹한의 얼음 호텔과 무대 특수효과 장비를 동원하여 손짓 하나로 얼음 결정을 피워내는 마법 같은 순간을 현실에 연출한 체험입니다.',
      feasibility: 'realistic',
      story: `영하 15도의 새하얀 얼음 궁전 스튜디오를 대관하고, 특수효과 팀과 함께 액체질소와 신비로운 푸른빛 조명을 세팅했습니다. 손을 허공으로 뻗는 순간 뿜어져 나오는 차가운 은백색 냉기 속에서 얼음 장미가 피어오르자, 숨을 헐떡이며 아이처럼 소리 내어 웃었습니다.\n\n어릴 적 간절히 원했던 기적은 마법 그 자체가 아니라, 순수한 경이로움에 눈을 반짝이던 나 자신의 모습이었음을 느꼈습니다.`,
      chronicle: `새하얀 얼음 궁전에서 어린 시절 꿈꾸었던 마법의 순간을 현실로 불러냈습니다.\n손끝에서 피어난 환상의 결정들은 차가운 현실을 따스한 동화의 빛으로 물들였습니다.`,
      status: 'ready',
      selected: false
    };
  }

  // Detour 4: Time Travel / Past
  if ((t.includes('시간') && (t.includes('여행') || t.includes('과거') || t.includes('타임머신') || t.includes('되돌리'))) || t.includes('time travel') || t.includes('time machine')) {
    if (lang === 'en') {
      return {
        id,
        text: trimmed,
        category: 'Mind & Inner Peace',
        cost: 1500,
        daysSpent: 7,
        lifespanDelta: 1.6,
        costBreakdown: 'Childhood neighborhood visit & retro studio rental $500 + Digital restoration of old film photos & VHS tapes $400 + Recreating childhood meals & keepsakes $600 = Total $1,500',
        rationale: 'Since physical time travel is impossible, this memory-restoration project recreates your childhood neighborhood, restores old tapes and photographs, and lets you reconcile in heart with your younger self.',
        feasibility: 'realistic',
        story: `You walked the old alleyways where you once lived and restored faded cassette tapes and black-and-white photographs. Standing beneath the same sunset light as all those years ago, you quietly embraced your clumsy, hurting younger self.\n\nThough time cannot be turned back, you affirmed that every passing moment was a precious piece that made you who you are, finally making peace with the past.`,
        chronicle: `Walking the alleys of bygone time once more, you shared a deep reconciliation with your younger self.\nCarrying the warmth of those memories, your steps made the remainder of your journey firmer and more peaceful.`,
        status: 'ready',
        selected: false
      };
    }
    return {
      id,
      text: trimmed,
      category: '정신과 내면',
      cost: 1500,
      daysSpent: 7,
      lifespanDelta: 1.6,
      costBreakdown: '어린 시절 옛 동네 방문 및 레트로 세트장 대관 $500 + 옛 필름 사진 및 낡은 비디오테이프 디지털 복원 $400 + 추억의 음식과 소품 재현 $600 = 총 $1,500',
      rationale: '물리적 시간 역행은 불가능하므로, 어린 시절의 동네와 레트로 공간을 복원하고 옛 일기와 사진을 재현하여 과거의 나 및 떠나간 이들과 마음으로 화해하는 추억 복원 프로젝트입니다.',
      feasibility: 'realistic',
      story: `오래전 살았던 옛 골목길을 찾아가고, 낡은 카세트테이프와 흑백 사진들을 복원했습니다. 그때 그 시절의 노을빛 아래 서서, 서툴고 아팠던 어린 시절의 나를 가만히 안아주었습니다.\n\n시간을 되돌릴 수는 없지만, 지나온 모든 순간이 지금의 나를 만든 소중한 조각이었음을 긍정하며 비로소 과거와 온전히 화해했습니다.`,
      chronicle: `흘러간 시간의 골목을 다시 걸으며 과거의 서툴렀던 자신과 깊은 화해를 나누었습니다.\n추억의 온기를 가슴에 품은 당신의 걸음은 남은 여정을 더욱 단단하고 평화롭게 만들었습니다.`,
      status: 'ready',
      selected: false
    };
  }

  // Default balanced item (English vs Korean)
  if (lang === 'en') {
    return {
      id,
      text: trimmed,
      category: 'Self-Fulfillment & Growth',
      cost: 3200,
      daysSpent: 21,
      lifespanDelta: 1.3,
      costBreakdown: 'Dedicated equipment, lessons & preparation $1,800 + 3 weeks of living & activity expenses $1,400 = Total $3,200',
      rationale: 'Realistic 3-week budget required to immerse yourself wholeheartedly in a long-postponed personal wish or craft.',
      feasibility: 'realistic',
      story: `You finally turned "${trimmed}"—something you had always put off for "someday when life gets quieter"—into reality.\n\nImmersed for three weeks in a moment you truly wished for, you tasted the deep, unmistakable joy of feeling fully alive.`,
      chronicle: `For 21 days, you faced a long-postponed wish and claimed time that belonged wholly to you.\nThose moments of listening closely to your inner voice added precious vitality to your life.`,
      status: 'ready',
      selected: false
    };
  }

  // Korean keyword heuristics
  if (t.includes('미국') || t.includes('뉴욕') || t.includes('하와이') || t.includes('샌프란시스코')) {
    return {
      id,
      text: trimmed,
      category: '모험과 자연',
      cost: 6000,
      daysSpent: 14,
      lifespanDelta: 1.4,
      costBreakdown: '국적기 왕복 항공권 $1,500 + 도심 중급 호텔(13박) $2,500 + 현지 식비/교통/문화 티켓 $2,000 = 총 $6,000',
      rationale: '14일간의 미국 여행 기준 현실 물가입니다. 최근 인플레이션, 팁 문화, 호텔 세금 및 유류할증료를 철저히 반영하여 과소 책정 없이 도출한 수치입니다.',
      feasibility: 'realistic',
      story: `맨해튼의 빌딩 숲과 브루클린 브리지 위를 거닐며 낯선 공기 속으로 온전히 걸어 들어갔습니다. 바쁜 일상의 시계는 멈추고 새로운 언어와 표정들이 내면의 굳은 경계들을 녹여냈습니다.\n\n광활한 대륙의 지평선을 마주한 순간, 가슴속 깊이 쌓여 있던 피로가 씻겨 나가며 진정한 자유를 누렸습니다.`,
      chronicle: `14일간 광활한 대륙의 지평선을 마주하며 세상의 무한한 가능성을 경험했습니다.\n낯선 풍경 속에서 건져 올린 순수한 순간들이 남은 생의 시계를 따뜻하게 확장시켰습니다.`,
      status: 'ready',
      selected: false
    };
  }

  if (t.includes('파티') || t.includes('초대') || t.includes('홈파티') || t.includes('요리')) {
    return {
      id,
      text: trimmed,
      category: '관계와 사랑',
      cost: 1600,
      daysSpent: 3,
      lifespanDelta: 1.4,
      costBreakdown: '신선한 최상급 식재료 $800 + 프리미엄 와인 및 주류 $500 + 식기 및 공간 장식 $300 = 총 $1,600',
      rationale: '20인 내외의 지인들을 초대해 홈파티를 진행할 때 필요한 식재료 구매비와 음료, 준비 용품을 반영한 표준 비용입니다.',
      feasibility: 'realistic',
      story: `이틀 동안 좋은 재료와 음료를 고르고, 초대할 이들을 떠올리며 정성껏 식탁을 준비했습니다.\n\n당일 저녁 따뜻한 조명 아래 둘러앉은 사람들의 진솔한 웃음과 따뜻한 포옹 속에서, 거창한 부가 아닌 다정한 식탁 하나만으로도 인생이 이토록 눈부시게 채워질 수 있음을 깨달았습니다.`,
      chronicle: `단 3일의 준비와 $1,600의 예산으로 소중한 인연들에게 평생 잊지 못할 밤을 선물했습니다.\n함께 나눈 온기와 웃음소리가 당신의 마음에 다시 없을 뜨거운 생명력을 불어넣었습니다.`,
      status: 'ready',
      selected: false
    };
  }

  if (t.includes('화해') || t.includes('친구') || t.includes('부모') || t.includes('가족') || t.includes('사랑')) {
    return {
      id,
      text: trimmed,
      category: '관계와 사랑',
      cost: 400,
      daysSpent: 2,
      lifespanDelta: 1.6,
      costBreakdown: '정갈한 식사 자리 $250 + 마음을 전하는 작은 선물 및 교통비 $150 = 총 $400',
      rationale: '오랜 갈등을 풀고 진심을 전하는 데에는 큰돈이 들지 않습니다. 진솔한 식사와 마음을 담은 선물을 위한 현실적 예산입니다.',
      feasibility: 'realistic',
      story: `오랫동안 망설이던 마음을 다잡고 먼저 손을 내밀었습니다. 마주 앉은 식탁에서 어색한 침묵 끝에 건넨 사과와 진심 어린 말 한마디에 오랜 시간 굳어 있던 응어리가 눈 녹듯 사라졌습니다.\n\n단 이틀의 용기로, 가슴 한구석을 무겁게 짓누르던 미련의 짐을 마침내 내려놓았습니다.`,
      chronicle: `가슴속 무거운 침묵의 매듭을 푸는 데는 많은 돈도 긴 세월도 필요치 않았습니다.\n용기 내어 건넨 진심이 당신의 영혼에 가장 맑고 가벼운 평온을 찾아주었습니다.`,
      status: 'ready',
      selected: false
    };
  }

  if (t.includes('책방') || t.includes('서점') || t.includes('북카페') || t.includes('카페') || t.includes('시골집') || t.includes('공방') || t.includes('개조')) {
    return {
      id,
      text: trimmed,
      category: '라이프스타일',
      cost: 35000,
      daysSpent: 60,
      lifespanDelta: 2.3,
      costBreakdown: '단기 임차 보증금/월세 $10,000 + 인테리어 및 셀프 리모델링 $15,000 + 설비 집기 $10,000 = 총 $35,000',
      rationale: '소규모 감성 북카페나 시골 공방을 2개월에 걸쳐 단장하고 문을 열기 위한 현실적인 설비 및 초기 임차 비용입니다.',
      feasibility: 'high_cost',
      story: `평생 꿈꾸던 나만의 공간을 위해 예산을 과감히 들여 인테리어와 집기를 준비했습니다. 두 달 동안 매일 땀 흘리며 공간을 채워 넣고 마침내 문을 열었습니다.\n\n내 취향과 철학이 담긴 공간에서 보낸 60일은 삶의 가장 빛나는 새로운 장이었습니다.`,
      chronicle: `충분한 예산과 60일의 정성을 들여 평생 꿈꾸던 나만의 공간을 세상에 열었습니다.\n그곳에서 피어난 새로운 일상이 당신의 시간을 눈부시게 확장시켰습니다.`,
      status: 'ready',
      selected: false
    };
  }

  if (t.includes('출판') || t.includes('책') || t.includes('에세이') || t.includes('글쓰기') || t.includes('소설')) {
    return {
      id,
      text: trimmed,
      category: '창작과 예술',
      cost: 4500,
      daysSpent: 45,
      lifespanDelta: 1.8,
      costBreakdown: '전문 교정/교열 $800 + 표지/내지 디자인 $1,200 + 300부 고급 옵셋 인쇄 및 유통 $2,500 = 총 $4,500',
      rationale: '개인 독립출판 단행본을 완성도 높은 품질로 300~500부 제작하여 서점에 등록 유통하는 표준 외주 제작 비용입니다.',
      feasibility: 'realistic',
      story: `45일 동안 새벽마다 홀로 책상에 앉아 지나온 삶의 흔적들을 문장으로 엮어냈습니다. 퇴고를 거듭하고 표지 종이를 고르며 인쇄를 마쳤습니다.\n\n갓 나온 책의 따뜻한 잉크 냄새를 맡았을 때, 내가 살아온 시간이 결코 헛되지 않은 온전한 이야기로 남았음을 느꼈습니다.`,
      chronicle: `45일간의 고독한 사색 끝에 당신의 삶을 담은 한 권의 책을 세상에 남겼습니다.\n종이 위에 새겨진 당신의 진실은 세월이 흘러도 바래지 않을 영원한 증명이 되었습니다.`,
      status: 'ready',
      selected: false
    };
  }

  if (t.includes('장학') || t.includes('재단') || t.includes('기부') || t.includes('후원') || t.includes('보호소')) {
    return {
      id,
      text: trimmed,
      category: '기여와 나눔',
      cost: 25000,
      daysSpent: 14,
      lifespanDelta: 2.0,
      costBreakdown: '직접 장학금 기금 출연 $20,000 + 비영리 단체 설립 등록 및 운영비 $5,000 = 총 $25,000',
      rationale: '어려운 학생 10여 명에게 실질적 학업 기회를 제공하거나 소규모 장학 사업을 개시하기에 적합한 기부 금액 규모입니다.',
      feasibility: 'high_cost',
      story: `내가 가진 예산의 상당 부분을 도움이 절실한 이들과 나누었습니다. 2주 동안 지원 체계를 다듬고 도움을 받을 사람들의 눈빛을 마주했습니다.\n\n비록 나의 시간은 유한할지라도, 나의 의지가 누군가의 삶 속에서 영원히 이어질 것이라는 벅찬 확신을 얻었습니다.`,
      chronicle: `당신의 예산으로 세상에 따뜻한 기부와 나눔의 씨앗을 심었습니다.\n누군가의 내일을 밝혔다는 숭고한 보람이 당신의 생명력을 단단하게 지탱했습니다.`,
      status: 'ready',
      selected: false
    };
  }

  if (t.includes('여행') || t.includes('오로라') || t.includes('순례') || t.includes('바다') || t.includes('숲')) {
    return {
      id,
      text: trimmed,
      category: '모험과 자연',
      cost: 6500,
      daysSpent: 20,
      lifespanDelta: 1.8,
      costBreakdown: '국제선 항공권 $1,600 + 20일간 숙박비 $2,600 + 현지 가이드 및 식비 $2,300 = 총 $6,500',
      rationale: '약 3주간의 장거리 해외 자연/순례 여행 시 소요되는 항공, 숙소, 이동 경비를 현실적으로 반영한 표준 견적입니다.',
      feasibility: 'realistic',
      story: `익숙한 일상을 벗어나 대자연의 품으로 떠났습니다. 20일 동안 새로운 하늘과 바람을 마주하며 마음을 짓누르던 세상의 잣대로부터 온전히 해방되었습니다.\n\n자연의 광활함 앞에서 마주한 평화는 내면의 두려움을 맑게 씻어냈습니다.`,
      chronicle: `20일간 광활한 풍경 속을 거닐며 온전한 자유와 해방감을 누렸습니다.\n세상의 시선을 벗어던진 자리에서 되찾은 순수한 숨결이 당신의 시간을 연장시켰습니다.`,
      status: 'ready',
      selected: false
    };
  }

  return {
    id,
    text: trimmed,
    category: '자기완성과 배움',
    cost: 3200,
    daysSpent: 21,
    lifespanDelta: 1.3,
    costBreakdown: '실행을 위한 전문 장비/도구/수강료 $1,800 + 3주간의 부대 실비 $1,400 = 총 $3,200',
    rationale: '3주간 한 가지 새로운 분야나 취미에 온전히 몰입하는 데 필요한 현실적 강습 및 기본 경비 기준입니다.',
    feasibility: 'realistic',
    story: `늘 '언젠가 여유가 생기면'이라며 미뤄두었던 [${trimmed}]을(를) 마침내 행동으로 옮겼습니다.\n\n3주 동안 진정으로 원했던 순간에 몰입하며, 살아있음을 실감케 하는 깊은 기쁨을 맛보았습니다.`,
    chronicle: `21일 동안 미뤄왔던 소망을 마주하며 온전한 나만의 시간을 보냈습니다.\n자신의 내면에 귀를 기울였던 몰입의 순간들이 삶에 소중한 활력을 더했습니다.`,
    status: 'ready',
    selected: false
  };
}

/**
 * Generates the "Argon Profile" (Genuine Self Profile) based on the 10 bucket list items.
 */
export function generateArgonProfile(items: BucketItem[], lang: Language = 'ko'): PlayerProfile {
  const categoriesCount: Record<string, number> = {};
  items.forEach(i => {
    const cat = i.category || (lang === 'en' ? 'Creative Achievement' : '창조적 성취');
    categoriesCount[cat] = (categoriesCount[cat] || 0) + 1;
  });

  const topCategory = Object.entries(categoriesCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  if (lang === 'en') {
    let coreValue = 'A life lived at your own rhythm and genuine connection';
    let summary = 'The bucket list you wrote points away from the speed and efficiency demanded by the world, revealing a deep longing to leave behind your own authentic trace and warm human connection.';
    let repressedDesires = 'Because of busy daily obligations and the expectations of others, you have long postponed the time to express yourself freely and sit deeply with the people who matter most.';

    if (topCategory.includes('Relationship') || topCategory === '관계와 사랑') {
      coreValue = 'Deep human bonds and love where hearts truly meet';
      summary = 'Your deepest inner self reaches not for grand wealth or status, but for a warm table of reconciliation and shared laughter with the people you cherish.';
      repressedDesires = 'Even expressing your sincerest feelings to those closest to you was put off amidst busyness, yet people were always what mattered most to you.';
    } else if (topCategory.includes('Creation') || topCategory === '창작과 예술') {
      coreValue = 'Creation that leaves a one-of-a-kind trace in the world';
      summary = 'You carry the soul of a creator who longs to shape lingering inspirations and inner voices into art, proving that you truly lived and felt.';
      repressedDesires = 'Though practical burdens forced you to set aside your artistic impulses, your passion to create never faded.';
    } else if (topCategory.includes('Giving') || topCategory === '기여와 나눔') {
      coreValue = 'Noble generosity that leaves a warm light for others';
      summary = 'You find your deepest fulfillment not in personal comfort, but in wiping away the tears of others and planting a meaningful legacy in the world.';
      repressedDesires = 'Even before the limit of finite time, you willingly reached out your hand to brighten someone else’s tomorrow.';
    } else if (topCategory.includes('Lifestyle') || topCategory.includes('Adventure') || topCategory === '라이프스타일' || topCategory === '모험과 자연') {
      coreValue = 'Complete freedom and serenity liberated from others’ standards';
      summary = 'You have longed to step away from endless competition and noise, surrendering to the rhythm of nature and dwelling quietly at your own pace.';
      repressedDesires = 'Beneath the world’s pressure to possess more, you paradoxically yearned for the simplest, purest freedom.';
    }

    return {
      status: 'ready',
      coreValue,
      summary,
      repressedDesires
    };
  }

  let coreValue = '나만의 호흡으로 채우는 삶과 진실한 관계';
  let summary = '당신이 적어 내려간 버킷리스트는 세상이 요구하는 효율과 속도에서 벗어나, 온전히 나만의 흔적과 따뜻한 온기를 남기고자 하는 깊은 소망을 가리키고 있습니다.';
  let repressedDesires = '바쁜 일상과 타인의 시선 때문에 진정으로 자신을 표현하고 소중한 사람들과 깊이 마주하는 시간을 오랫동안 유예해 왔습니다.';

  if (topCategory === '관계와 사랑') {
    coreValue = '마음과 마음이 맞닿는 깊은 유대와 사랑';
    summary = '당신의 가장 깊은 내면은 거창한 성공이나 사치가 아닌, 소중한 사람들과 마주 앉아 온기를 나누는 식탁과 화해를 향하고 있습니다.';
    repressedDesires = '가장 가까운 이들에게 진심을 전하는 일조차 일의 바쁨 속에 미뤄두었지만, 당신에게 가장 중요한 것은 결국 사람이었습니다.';
  } else if (topCategory === '창작과 예술') {
    coreValue = '세상에 단 하나뿐인 나만의 흔적을 남기는 창조';
    summary = '당신은 머릿속에만 맴돌던 영감과 목소리를 물질과 예술로 빚어내어, 내가 존재했음을 세상에 증명하고 싶어 하는 창작자의 영혼을 지녔습니다.';
    repressedDesires = '생계와 현실의 무게에 눌려 예술적 충동을 억눌러 왔지만, 창작의 열망은 결코 사그라들지 않았습니다.';
  } else if (topCategory === '기여와 나눔') {
    coreValue = '세상에 따뜻한 빛을 남기는 숭고한 기여';
    summary = '당신은 나 자신의 안위보다 타인과 약자의 눈물을 닦아주고, 세상에 의미 있는 유산을 심는 것에서 가장 깊은 충만함을 느끼는 사람입니다.';
    repressedDesires = '한정된 삶의 시간 앞에서도 당신은 기꺼이 손을 내밀어 타인의 내일을 밝히고자 했습니다.';
  } else if (topCategory === '라이프스타일' || topCategory === '모험과 자연') {
    coreValue = '타인의 잣대에서 해방된 온전한 자유와 평화';
    summary = '당신은 끊임없는 경쟁과 소음에서 벗어나, 자연의 호흡에 몸을 맡기고 나다운 속도로 고요히 머물기를 갈망해 왔습니다.';
    repressedDesires = '더 많은 것을 소유하라는 세상의 압박 속에서, 역설적이게도 가장 단순하고 담백한 자유를 갈망해 왔습니다.';
  }

  return {
    status: 'ready',
    coreValue,
    summary,
    repressedDesires
  };
}

/**
 * Compiles the sequential slides for the Frostpunk-style ending.
 */
export function compileEndingSlides(
  history: BucketItem[],
  allBucketItems: BucketItem[],
  profile: PlayerProfile,
  initialBudget: number,
  remainingBudget: number,
  initialMonths: number,
  finalMonths: number
): EndingSlide[] {
  const slides: EndingSlide[] = [];

  // Phase 1: Individual Choice Slides (1 slide per choice made)
  history.forEach((record, index) => {
    slides.push({
      type: 'choice',
      turn: index + 1,
      title: record.text,
      days: record.daysSpent,
      cost: record.actualCost || record.cost,
      lifeDelta: record.lifespanDelta,
      chronicle: record.chronicle
    });
  });

  // Phase 2: The Reckoning (Summary of achieved vs left behind)
  const totalSpent = initialBudget - remainingBudget;
  const totalLifeGained = history.reduce((acc, c) => acc + c.lifespanDelta, 0).toFixed(1);
  const unchosen = allBucketItems.filter(b => !b.selected).map(b => b.text);

  slides.push({
    type: 'summary',
    totalSpent,
    chosenCount: history.length,
    totalLifeGained,
    finalMonths,
    unchosen
  });

  // Phase 3: Argon Profile (Genuine Self Analysis)
  slides.push({
    type: 'argon_profile'
  });

  // Phase 4: Final Artwork & Philosophical Awakening
  slides.push({
    type: 'artwork_awakening'
  });

  return slides;
}
