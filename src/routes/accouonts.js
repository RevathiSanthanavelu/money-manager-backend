router.post("/transfer", async (req, res) => {
  const { fromId, toId, amount } = req.body;

  const from = await Account.findById(fromId);
  const to = await Account.findById(toId);

  if (from.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  from.balance -= amount;
  to.balance += amount;

  await from.save();
  await to.save();

  res.json({ message: "Transfer successful" });
});
