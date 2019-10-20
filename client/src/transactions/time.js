const EPOCH_TIME = new Date(Date.UTC(2019, 9, 18, 17, 0, 0, 0));
export const EPOCH_TIME_MILLISECONDS = EPOCH_TIME.getTime();
const MS_TIME = 1000;

export const getTimeFromBlockchainEpoch = (givenTimestamp) => {
  const startingPoint = givenTimestamp || new Date().getTime();
  return Math.floor((startingPoint - EPOCH_TIME_MILLISECONDS) / MS_TIME);
};

export const getTimeWithOffset = (offset) => {
  const now = new Date().getTime();
  const timeWithOffset = offset ? now + offset * MS_TIME : now;

  return getTimeFromBlockchainEpoch(timeWithOffset);
};

export const getTimestamp = () => {
  const epoch = new Date(Date.UTC(2019, 9, 18, 17, 0, 0, 0)).toISOString();
  const timeAfterEpoch = Date.now() - Date.parse(epoch);
  return parseInt(timeAfterEpoch / 1000 );
};
