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

export type dataTypeCreateCalled = {
  idCustomer: string
  titleCalled: string
  description: string
  dateCustomer: string
  hourCustomer: string
  idServices: string
}

type ExecuteCreateCalled = {
  name: 'executeCreateCalled';
  args: { data: dataTypeCreateCalled };
}

type ExecuteServices = {
  name: 'executeServices';
  args: { searchServices: string };
};

type ExecuteByUser = {
  name: 'executeByUser';
  args: { email: string };
};

export type AllFunctionCalls = 
  ExecuteQueryCall | 
  ExecuteCalledsCall | 
  ExecuteCalledIdCall | 
  ExecuteCreateCalled | 
  ExecuteServices |
  ExecuteByUser