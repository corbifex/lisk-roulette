SELECT
	"type",
	"bets",
	"wins",
	"payout",
	"wagered",
	"height"
FROM global_stats

${parsedFilters:raw}

${parsedSort:raw}

LIMIT ${limit} OFFSET ${offset}
