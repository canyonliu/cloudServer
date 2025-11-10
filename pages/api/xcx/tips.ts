import { NextApiRequest, NextApiResponse } from 'next';

// A collection of 20 motivational tips in Chinese.
const motivationalTips: string[] = [
  "相信自己，你就已经成功了一半。",
  "做伟大工作的唯一方法是热爱你所做的事。",
  "成功不是终点，失败也非末日，最重要的是继续前进的勇气。",
  "千里之行，始于足下。",
  "别盯着时钟，学它一样，不停地走。",
  "你越努力，得到时的感觉就越幸福。",
  "梦想大一点，格局大一点。",
  "你的局限，只在于你的想象。",
  "逼自己一把，因为没人会替你这样做。",
  "伟大的成就永远不会来自舒适区。",
  "成功不会主动来找你，你必须自己去争取。",
  "你最终会成为怎样的人，取决于你自己的决定。",
  "带着决心起床，带着满意入睡。",
  "事情会很难，但“难”不代表“不可能”。",
  "成功的关键是专注于目标，而不是障碍。",
  "今天做一些事，让你未来的自己能够感激你。",
  "你比你正在经历的困难要强大得多。",
  "每天一小步，成就一大步。",
  "预测未来的最好方法就是去创造未来。",
  "感觉最无力的时候，才最需要保持坚强。"
];

/**
 * API handler to provide a random motivational tip for the mini-program (XCX).
 * This endpoint is open and does not require user authentication.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure the request method is GET.
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Select a random tip from the array.
  const randomIndex = Math.floor(Math.random() * motivationalTips.length);
  const randomTip = motivationalTips[randomIndex];

  // Return the tip as a JSON response.
  // We use a structured response in case we want to add more data in the future.
  return res.status(200).json({
    code: 0,
    message: 'Success',
    data: {
      tip: randomTip,
    },
  });
}
