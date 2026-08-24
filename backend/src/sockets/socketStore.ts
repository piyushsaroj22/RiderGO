import { ConnectedAccount } from "./socket.types.js";

const connectedAccounts = new Map<string, ConnectedAccount>();

const getKey = (accountType: string, accountId: string) => {
  return `${accountType}:${accountId}`;
};

export const addConnectedAccount = (account: ConnectedAccount) => {
  connectedAccounts.set(
    getKey(account.accountType, account.accountId),
    account,
  );
};

export const removeConnectedAccount = (
  accountType: string,
  accountId: string,
  socketId: string,
) => {
  const key = getKey(accountType, accountId);

  const connectedAccount = connectedAccounts.get(key);

  if (!connectedAccount) {
    return;
  }

  // Do not remove a newer socket connection
  if (connectedAccount.socketId !== socketId) {
    return;
  }

  connectedAccounts.delete(key);
};

export const getConnectedAccount = (accountType: string, accountId: string) => {
  return connectedAccounts.get(getKey(accountType, accountId));
};

export const getConnectedAccounts = () => {
  return connectedAccounts;
};
