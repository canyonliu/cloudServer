import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Alert, Input } from 'antd';

interface AqiData {
  area: string;
  aqi: number;
  quality: string;
  pm25: string;
  pm10: string;
  o3: string;
  no2: string;
  so2: string;
  co: string;
  tips: string;
}

interface AqiPageProps {
  aqiData?: AqiData;
  error?: string;
}

// 根据AQI值返回对应的Tailwind颜色类
const getAqiColor = (aqi: number): string => {
  if (aqi <= 50) return 'bg-green-500';
  if (aqi <= 100) return 'bg-yellow-400';
  if (aqi <= 150) return 'bg-orange-500';
  if (aqi <= 200) return 'bg-red-500';
  if (aqi <= 300) return 'bg-purple-600';
  return 'bg-red-800';
};

const PollutantDisplay = ({ name, value }: { name: string; value: string }) => (
  <div className="text-center p-2 bg-white/10 rounded-lg">
    <p className="text-sm opacity-80">{name}</p>
    <p className="font-bold text-lg">{value}</p>
  </div>
);

const AqiPage: NextPage<AqiPageProps> = ({ aqiData, error }) => {
  const router = useRouter();

  const onSearch = (value: string) => {
    if (value) {
      router.push(`/weather?city=${value}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4 text-white">
      <Head>
        <title>空气质量查询</title>
      </Head>

      <div className="w-full max-w-md mb-8">
        <Input.Search
          placeholder="输入城市名查询，例如：北京"
          onSearch={onSearch}
          enterButton="查询"
          size="large"
        />
      </div>

      {error && <Alert message="错误" description={error} type="error" showIcon className="max-w-md" />}

      {aqiData && (
        <div className="bg-gray-700/50 backdrop-blur-lg rounded-2xl shadow-lg p-8 w-full max-w-md animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-4">{aqiData.area}</h2>
          <div className={`w-48 h-48 rounded-full mx-auto flex flex-col items-center justify-center ${getAqiColor(aqiData.aqi)}`}>
            <div className="text-5xl font-extrabold">{aqiData.aqi}</div>
            <div className="text-xl font-semibold">{aqiData.quality}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 my-6">
            <PollutantDisplay name="PM2.5" value={aqiData.pm25} />
            <PollutantDisplay name="PM10" value={aqiData.pm10} />
            <PollutantDisplay name="O₃" value={aqiData.o3} />
            <PollutantDisplay name="NO₂" value={aqiData.no2} />
            <PollutantDisplay name="SO₂" value={aqiData.so2} />
            <PollutantDisplay name="CO" value={aqiData.co} />
          </div>
          <p className="mt-4 text-center text-gray-300">{aqiData.tips}</p>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const city = context.query.city || '北京';
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return { props: { error: '未在服务器上配置NEWS_API_KEY环境变量。' } };
  }

  try {
    const res = await fetch(`https://apis.tianapi.com/aqi/index?key=${apiKey}&area=${city}`);
    const data = await res.json();

    if (data.code !== 200) {
      throw new Error(data.msg);
    }

    return { props: { aqiData: data.result } };
  } catch (err: any) {
    return { props: { error: `获取空气质量失败: ${err.message}` } };
  }
};

export default AqiPage;