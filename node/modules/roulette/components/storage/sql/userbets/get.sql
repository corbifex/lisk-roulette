SELECT
	"accountId",
    "bets",
    "wins",
    "payout",
    "wagered",
    "lastTx",
    "registered"
FROM user_stats

${parsedFilters:raw}

${parsedSort:raw}

LIMIT ${limit} OFFSET ${offset}
