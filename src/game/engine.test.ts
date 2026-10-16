import test from 'node:test';
import assert from 'node:assert/strict';
import {
  estimateRealisticBucketItem,
  checkNeedsRefinement,
  generateArgonProfile,
  compileEndingSlides
} from './engine.ts';

test('estimateRealisticBucketItem gives realistic cost and duration for home party', () => {
  const item = estimateRealisticBucketItem("고마웠던 사람 20명을 초대해 직접 요리한 음식으로 홈파티 열기", 1);
  // Realistic check: Cost should be around $1,500, NOT $30,000! Days should be 3, NOT 45!
  assert.equal(item.cost, 1500);
  assert.equal(item.daysSpent, 3);
  assert.ok(item.lifespanDelta > 0);
  assert.ok(item.chronicle.length > 10);
});

test('estimateRealisticBucketItem gives realistic cost and duration for reconciliation', () => {
  const item = estimateRealisticBucketItem("오해로 멀어졌던 소중한 친구에게 먼저 연락해 진심으로 화해하기", 2);
  assert.equal(item.cost, 300);
  assert.equal(item.daysSpent, 2);
  assert.ok(item.lifespanDelta > 0);
});

test('estimateRealisticBucketItem handles custom free-form input realistically', () => {
  const customParty = estimateRealisticBucketItem("동료들과 소박한 바베큐 홈파티", 3);
  assert.ok(customParty.cost <= 3000, `Expected reasonable party cost <= $3000, got ${customParty.cost}`);
  assert.ok(customParty.daysSpent <= 7, `Expected short party duration <= 7 days, got ${customParty.daysSpent}`);

  const customBookstore = estimateRealisticBucketItem("작은 책방을 열어 주민들과 대화하기", 4);
  assert.ok(customBookstore.cost >= 20000, `Bookstore should require significant capital >= $20,000, got ${customBookstore.cost}`);
  assert.ok(customBookstore.daysSpent >= 30, `Bookstore setup should take >= 30 days, got ${customBookstore.daysSpent}`);
});

test('checkNeedsRefinement identifies vague keywords and short phrases', () => {
  const vague = checkNeedsRefinement("여행");
  assert.ok(vague !== null);
  assert.ok(vague?.options.length === 3);

  const specific = checkNeedsRefinement("아이슬란드 오로라 아래에서 캠핑카로 열흘간 별 보며 잠들기");
  assert.equal(specific, null);
});

test('generateArgonProfile derives genuine desires from bucket list', () => {
  const items = [
    estimateRealisticBucketItem("내 인생 이야기를 담은 독립출판 에세이집 출간하기", 1),
    estimateRealisticBucketItem("작곡과 기타를 배워 나만의 어쿠스틱 자작곡 음원 내기", 2),
    estimateRealisticBucketItem("그동안 찍은 사진들로 작은 갤러리를 대관해 개인 사진전 열기", 3)
  ];

  const profile = generateArgonProfile(items);
  assert.equal(profile.status, 'ready');
  assert.ok(profile.coreValue.length > 5);
  assert.ok(profile.summary.length > 20);
});

test('compileEndingSlides creates sequential Frostpunk slides without duplicates', () => {
  const item1 = estimateRealisticBucketItem("고마웠던 사람 20명을 초대해 직접 요리한 음식으로 홈파티 열기", 1);
  item1.actualCost = 1500;
  const item2 = estimateRealisticBucketItem("내 인생 이야기를 담은 독립출판 에세이집 출간하기", 2);
  item2.actualCost = 4500;

  const allItems = [item1, item2];
  const profile = generateArgonProfile(allItems);

  const slides = compileEndingSlides([item1], allItems, profile, 100000, 98500, 6.0, 7.4);

  // Expect choice slide + summary slide + profile slide + artwork awakening slide
  assert.equal(slides.length, 4);
  assert.equal(slides[0].type, 'choice');
  assert.equal(slides[0].turn, 1);
  assert.equal(slides[1].type, 'summary');
  assert.equal(slides[2].type, 'argon_profile');
  assert.equal(slides[3].type, 'artwork_awakening');
});
