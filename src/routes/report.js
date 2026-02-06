// routes/report.js
router.get("/summary", async (req, res) => {
  const { type } = req.query; // week | month | year

  let groupBy;
  if (type === "week") groupBy = { $week: "$date" };
  else if (type === "month") groupBy = { $month: "$date" };
  else groupBy = { $year: "$date" };

  const data = await Transaction.aggregate([
    {
      $group: {
        _id: groupBy,
        income: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
        },
        expense: {
          $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
        }
      }
    }
  ]);

  res.json(data);
});
