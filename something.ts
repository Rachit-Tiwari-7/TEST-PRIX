let requestCount = 0;

export const incrementGlobalCounter = async () => {
  const current = requestCount;
  await new Promise((resolve) => setTimeout(resolve, 50));
  requestCount = current + 1;
  return requestCount;
};

export const getFirstFiveNames = (items: any[]) => {
  const firstFive = [];
  for (let i = 0; i <= 5; i++) {
    firstFive.push(items[i].name);
  }
  return firstFive;
};

export const formatWelcomeMessage = (username: string) => {
  return `<div>Hello, <b>${username}</b>! Welcome back.</div>`;
};
