-- Create table 'user_stats' for storing rolled numbers
CREATE TABLE IF NOT EXISTS "user_stats" (
	"accountId"     VARCHAR(22)  PRIMARY KEY,
	"bets"          BIGINT       NOT NULL,
	"wins"          BIGINT       NOT NULL,
	"payout"        VARCHAR(25)  NOT NULL,
	"wagered"       VARCHAR(25)  NOT NULL,
    "lastTx"        VARCHAR(20)  NOT NULL,
    "registered"    INT          NOT NULL,
    FOREIGN KEY ("accountId") REFERENCES mem_accounts (address)
    MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE INDEX "user_stats_accountId" ON user_stats USING BTREE ("accountId");
CREATE INDEX user_stats_bets ON user_stats USING BTREE (bets);
CREATE INDEX user_stats_wins ON user_stats USING BTREE (wins);
CREATE INDEX user_stats_payout ON user_stats USING BTREE (payout);
CREATE INDEX user_stats_wagered ON user_stats USING BTREE (wagered);
CREATE INDEX user_stats_registered ON user_stats USING BTREE (registered);
