type ExecuteQueryCall = {
  name: 'executeQuery';
  args: { querySQL: string };
};

type ExecuteCalledsCall = {
  name: 'executeCalleds';
  args: { emailUser: string };
};

type ExecuteCalledIdCall = {
  name: 'executeCalledId';
  args: { id: string };
};

export type AllFunctionCalls = ExecuteQueryCall | ExecuteCalledsCall | ExecuteCalledIdCall