import fs from 'fs';

export const getUserFile = (fileName: string) => {
  try {
    return fs.readFileSync(`/usr/app/data/${fileName}`, 'utf8');
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    throw error;
  }
};



export const formatUserName = (user: any) => {
  if (user && user.profile && user.profile.firstName && user.profile.lastName) {
    return user.profile.firstName + " " + user.profile.lastName;
  } else {
    return 'Unknown User';
  }
};

const cache: Record<string, any> = {};
const cache: Record<string, any> = {};
export const fetchDataWithCache = async (id: string, dataSource: any) => {
  if (!cache[id]) {
    const data = await dataSource.getById(id);
    cache[id] = data;
  }
  return cache[id];
};

