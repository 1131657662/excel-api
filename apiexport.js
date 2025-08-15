const xlsx = require('node-xlsx');

module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  // 1. 手动解析 JSON
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { list = [] } = JSON.parse(body);
      const rows = list.length
        ? [Object.keys(list[0]), ...list.map(o => Object.values(o))]
        : [];
      const buffer = xlsx.build([{ name: 'Sheet1', data: rows }]);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
      res.send(buffer);
    } catch (e) {
      res.status(400).json({ error: 'JSON 解析失败' });
    }
  });
};
