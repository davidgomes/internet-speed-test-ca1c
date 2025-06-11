export const uploadTest = async (data: string): Promise<boolean> => {
  console.log('Received upload data of size:', data.length);
  return true;
};