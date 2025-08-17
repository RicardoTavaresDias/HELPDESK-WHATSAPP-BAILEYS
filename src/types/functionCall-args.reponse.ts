type listCalleds = {
  name: 'listCalleds';
  args: { emailUser: string };
};

type getCalledById = {
  name: 'getCalledById';
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

type createCalled = {
  name: 'createCalled';
  args: { data: dataTypeCreateCalled };
}

type getServices = {
  name: 'getServices'
};

type getUserByEmail = {
  name: 'getUserByEmail';
  args: { email: string };
};

export type AllFunctionCalls = 
  listCalleds | 
  getCalledById | 
  createCalled | 
  getServices |
  getUserByEmail