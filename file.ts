import fs from 'fs';

export const getUserFile = (fileName: string) => {
  return fs.readFileSync(`/usr/app/data/${fileName}`, 'utf8');
};


export const formatUserName = (user: any) => {
  return user.profile.firstName + " " + user.profile.lastName;
};
const cache: Record<string, any> = {};
export const fetchDataWithCache = async (id: string, dataSource: any) => {
  if (!cache[id]) {
    const data = await dataSource.getById(id);
    cache[id] = data;
  }
  return cache[id];
};
