UPDATE global_stats
SET "bets" = ${bets}, "wins" = ${win}, "payout"= ${payout}, "wagered" = ${wagered}, "height"=${height}
WHERE "type" = ${type}
