-- Create table 'global_stats' for storing rolled numbers
CREATE TABLE IF NOT EXISTS "global_stats" (
	"type"     VARCHAR(10)  PRIMARY KEY,
	"bets"     BIGINT       NOT NULL,
	"wins"     BIGINT       NOT NULL,
	"payout"   VARCHAR(25)  NOT NULL,
	"wagered"  VARCHAR(25)  NOT NULL,
    "height"   BIGINT       NOT NULL
);

INSERT INTO "global_stats" (
    "type", "bets", "wins", "payout", "wagered", "height"
) VALUES
    ('day', 0, 0, '0', '0', 0),
    ('week', 0, 0, '0', '0', 0),
    ('month', 0, 0, '0', '0', 0),
    ('year', 0, 0, '0', '0', 0),
    ('all', 0, 0, '0', '0', 0);
