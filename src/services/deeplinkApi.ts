import axios from 'axios';
import { toQueryString } from '../utils/api';

const DEEPLINK_URL = "https://api.linkprice.com/ci/service/custom_link_xml.php";

export const fetchDeeplinkUrl = async (
  merchantId: string,
  url: string,
): Promise<string> => {
  // try {
  //   const response = await axios.get(`${DEEPLINK_URL}?${toQueryString({
  //     a_id: 'A100703714',
  //     url: encodeURIComponent(url),
  //     mode: 'json',
  //   })}`);
  //   if (response.status === 200) {
  //     const json = response.data;
  //     const urlLength = json?.url?.length ?? 0;
  //     if (urlLength > 0) {
  //       return json.url;
  //     }
  //   }
  // } catch (error) {
  //     console.error('딥링크 URL을 가져오는 중 오류가 발생했습니다:', error);
  // }
  return `https://lpweb.kr/click.php?m=${merchantId}&a=A100703714&l_cd1=3&l_cd2=0&l=9999&tu=${encodeURIComponent(url)}`;

  // return url; // 실패 시 원래 URL 반환
};
