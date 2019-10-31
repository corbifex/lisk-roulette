UPDATE user_stats
SET "bets" = ${bets}, "wins" = ${wins}, "payout" = ${payout}, "wagered" = ${wagered}, "lastTx" = ${lastTx}
WHERE "accountId" = ${address}
