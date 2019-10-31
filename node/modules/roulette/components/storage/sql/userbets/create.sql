INSERT INTO "user_stats" (
    "accountId",
    "bets",
    "wins",
    "payout",
    "wagered",
    "lastTx",
    "registered"
) VALUES
    (${address}, 0, 0, 0, 0, 0, ${date});
