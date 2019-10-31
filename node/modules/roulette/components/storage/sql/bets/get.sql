SELECT
	"number",
	"count",
	"last"
FROM bets

${parsedFilters:raw}

${parsedSort:raw}

LIMIT ${limit} OFFSET ${offset}
