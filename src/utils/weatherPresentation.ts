import type { ClothingCategory } from '../types';

const METRIC_HINTS = {
  uvIndex: [
    { range: [0, 2], label: '비타민 D 도핑 가능' },
    { range: [3, 5], label: '피부 탄력을 위해 썬크림은 필수!' },
    { range: [6, 7], label: '피부 다 죽는다...' },
    { range: [8, 10], label: '죽을지도모름' },
    { range: [11, Number.POSITIVE_INFINITY], label: '연차쓰세요.' },
  ],
  rain: [
    { range: [0, 20], label: '비 맞으면 로또사셈' },
    { range: [21, 60], label: '홀~짝!' },
    { range: [61, 100], label: '짱큰장우산챙기세요' },
  ],
  pm10: [
    { range: [0, 22], label: '공기 싹싹김치' },
    { range: [23, 45], label: '이정도면 참고 나갈만 해' },
    { range: [46, 100], label: '꼭 나가야 할까요?' },
    { range: [101, Number.POSITIVE_INFINITY], label: '공기청정기 야근특근' },
  ],
  pm2_5: [
    { range: [0, 9], label: '공기 싹싹김치' },
    { range: [10, 15], label: '이정도면 참고 나갈만 해' },
    { range: [16, 50], label: '꼭 나가야 할까요?' },
    { range: [51, Number.POSITIVE_INFINITY], label: '공기청정기 야근특근' },
  ],
  humidity: [
    { range: [0, 29], label: '가습기 틀기 (밥솥가능)' },
    { range: [30, 60], label: '쾌적하네요 호호' },
    { range: [61, 80], label: '팡이제로 ㄱㄱ' },
    { range: [81, Number.POSITIVE_INFINITY], label: '비왔거나, 비오거나' },
  ],
  windSpeed: [
    { range: [0, 1.5], label: '미니선풍기라도 틀어줄까?' },
    { range: [1.6, 5.4], label: '자연풍' },
    { range: [5.5, 10.7], label: '머리말리기 딱 좋다' },
    { range: [10.8, 17.1], label: '머리위를 조심하세요' },
    { range: [17.2, Number.POSITIVE_INFINITY], label: '죽을지도 모릅니다' },
  ],
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
) {
  return (
    METRIC_HINTS[key].find((item) => {
      const [min, max] = item.range;
      const numericValue = Number(value);
      return numericValue >= min && numericValue <= max;
    })?.label ?? ''
  );
}
