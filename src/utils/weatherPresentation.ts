import type { ClothingCategory } from '../types';

type TimeAwareLabel =
  | string
  | {
      day: string;
      night: string;
    };

type MetricHintItem = {
  range: [number, number];
  label: TimeAwareLabel;
};

const METRIC_HINTS = {
  uvIndex: [
    {
      range: [0, 2],
      label: {
        day: '비타민 D 도핑 가능',
        night: '해가 졌으니 자외선 걱정은 접어두세요',
      },
    },
    {
      range: [3, 5],
      label: {
        day: '피부 탄력을 위해 썬크림은 필수!',
        night: '야간 수치라 체감 자외선 부담은 낮아요',
      },
    },
    {
      range: [6, 7],
      label: {
        day: '피부 다 죽는다...',
        night: '수치는 높아도 밤이라 자외선 대응 우선순위는 낮아요',
      },
    },
    {
      range: [8, 10],
      label: {
        day: '죽을지도모름',
        night: '밤 기준으로는 자외선보다 기온 체감을 먼저 보세요',
      },
    },
    {
      range: [11, Number.POSITIVE_INFINITY],
      label: {
        day: '연차쓰세요.',
        night: '야간 값이라면 자외선보다 다른 지표를 믿는 편이 맞습니다',
      },
    },
  ] satisfies MetricHintItem[],
  rain: [
    { range: [0, 20], label: '비 맞으면 로또사셈' },
    { range: [21, 60], label: '홀~짝!' },
    { range: [61, 100], label: '짱큰장우산챙기세요' },
  ] satisfies MetricHintItem[],
  pm10: [
    { range: [0, 22], label: '공기 싹싹김치' },
    { range: [23, 45], label: '이정도면 참고 나갈만 해' },
    { range: [46, 100], label: '꼭 나가야 할까요?' },
    { range: [101, Number.POSITIVE_INFINITY], label: '공기청정기 야근특근' },
  ] satisfies MetricHintItem[],
  pm2_5: [
    { range: [0, 9], label: '공기 싹싹김치' },
    { range: [10, 15], label: '이정도면 참고 나갈만 해' },
    { range: [16, 50], label: '꼭 나가야 할까요?' },
    { range: [51, Number.POSITIVE_INFINITY], label: '공기청정기 야근특근' },
  ] satisfies MetricHintItem[],
  humidity: [
    { range: [0, 29], label: '가습기 틀기 (밥솥가능)' },
    { range: [30, 60], label: '쾌적하네요 호호' },
    { range: [61, 80], label: '팡이제로 ㄱㄱ' },
    { range: [81, Number.POSITIVE_INFINITY], label: '비왔거나, 비오거나' },
  ] satisfies MetricHintItem[],
  windSpeed: [
    { range: [0, 1.5], label: '미니선풍기라도 틀어줄까?' },
    { range: [1.6, 5.4], label: '자연풍' },
    { range: [5.5, 10.7], label: '머리말리기 딱 좋다' },
    { range: [10.8, 17.1], label: '머리위를 조심하세요' },
    { range: [17.2, Number.POSITIVE_INFINITY], label: '죽을지도 모릅니다' },
  ] satisfies MetricHintItem[],
} as const;

export const categoryLabels: Record<ClothingCategory, string> = {
  light: '가벼운 착장',
  layered: '레이어드',
  warm: '보온 중심',
  'rain-ready': '우천 대비',
  'sun-ready': '자외선 대비',
};

export function formatObservationTime(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function getMetricHint(
  key: keyof typeof METRIC_HINTS,
  value: string | number,
  isDay = true,
) {
  const matchedItem = METRIC_HINTS[key].find((item) => {
    const [min, max] = item.range;
    const numericValue = Number(value);
    return numericValue >= min && numericValue <= max;
  });

  if (!matchedItem) {
    return '';
  }

  return typeof matchedItem.label === 'string'
    ? matchedItem.label
    : isDay
      ? matchedItem.label.day
      : matchedItem.label.night;
}
